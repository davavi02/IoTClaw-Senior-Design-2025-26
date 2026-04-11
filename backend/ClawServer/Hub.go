//https://github.com/gorilla/websocket/blob/main/examples/chat/hub.go

// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"fmt"
	"time"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan *Packet

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// outbound messages
	outboundMessage chan *Packet

	//Cabinent
	cabinent *Client

	//Information about the game
	gameData *GameData

	queue *Queue

	//USed to delete the game from the list when we are done.
	activeGames *ActiveGames

	server *Server

	cabDCTimer *time.Timer

	qDCTimer *time.Timer
}

func newHub(container *ActiveGames, gameData *GameData, srv *Server) *Hub {
	return &Hub{
		broadcast:       make(chan *Packet),
		register:        make(chan *Client),
		unregister:      make(chan *Client),
		outboundMessage: make(chan *Packet, 256),
		clients:         make(map[*Client]bool),
		gameData:        gameData,
		activeGames:     container,
		cabinent:        nil,
		queue:           CreateQueue(),
		server:          srv,
		cabDCTimer:      time.NewTimer(3 * time.Minute),
		qDCTimer:        time.NewTimer(1 * time.Hour),
	}
}

func (h *Hub) run() {
	for {
		select {
		case <-h.cabDCTimer.C:
			fmt.Println("Deleting room, cabinent timeout.")
			for x, _ := range h.clients {
				if x != nil {
					x.send <- NewPacketUInt8(204, x)
					close(x.send)
					delete(h.clients, x)
				}
			}
			h.clients = nil
			h.queue = nil
			h.activeGames.DeleteRoom(h.gameData.Name)
			return

		case client := <-h.register:
			if client.isCabinent {
				h.cabinent = client
				h.cabDCTimer.Stop()
				//Broadcast we arrived
				for x, _ := range h.clients {
					if x != nil {
						h.outboundMessage <- NewPacketUInt8(206, x)
						fmt.Println("Cabinent connected, oh yeah.")
					}
				}
			}
			h.clients[client] = true

		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				//Removes client.
				h.RemoveFromQueue(client)
				delete(h.clients, client)
				close(client.send)

				if client.isCabinent {
					h.cabinent = nil
					h.cabDCTimer.Reset(time.Minute * 3)
					fmt.Println("Cabinent dcd, time starting to nuke room.")

					//Spread the gospel the client dcd.
					for x, _ := range h.clients {
						if x != nil {
							h.outboundMessage <- NewPacketUInt8(203, x)
						}
					}
				}
			}

		case <-h.qDCTimer.C:
			fmt.Println("Front of queue timeout..")
			h.RemoveFromQueue(nil)
			if h.cabinent != nil {
				h.outboundMessage <- NewPacketUInt8(203, h.cabinent)
			}

		case message := <-h.broadcast:
			if h.cabinent == nil {
				continue
			}
			if message.Sender == h.cabinent {
				h.handleServerMessage(message)
			} else {
				h.handleClientMessage(message)
			}
			/*select {
			case h.cabinent.send <- message:
			default:
				close(h.cabinent.send)
				delete(h.clients, h.cabinent)
				h.cabinent = nil
			}*/

		case message := <-h.outboundMessage:
			if _, ok := h.clients[message.Sender]; ok {
				select {
				case message.Sender.send <- message:
				default:
					h.RemoveFromQueue(message.Sender)
					delete(h.clients, message.Sender)
					close(message.Sender.send)
				}
			}
		}
	}
}

func (h *Hub) handleClientMessage(message *Packet) {
	data, err := message.GetPacketData()
	if err {
		return
	}

	if message.Sender == nil {
		return
	}

	if (data >= 0 && data <= 6) || (data >= 8 && data <= 32) {
		//Control messages lets see if they are first
		if message.Sender == h.queue.GetFrontQueue() {
			if h.cabinent != nil {
				h.outboundMessage <- NewPacketUInt8(data, h.cabinent)
			}
		}
	}

	switch data {
	case 200:
		h.joinQueue(message.Sender)

	case 204:
		h.RemoveFromQueue(message.Sender)
	}
}

func (h *Hub) handleServerMessage(message *Packet) {
	data, err := message.GetPacketData()
	if err {
		return
	}

	switch data {
	case 0:
		//Win logic here...
		cli := h.queue.GetFrontQueue()
		if cli != nil {
			uid, err := cli.jwtData.GetUserIdAsInt64()
			if err == nil {
				err = AwardPrize(1, uid, h.server)
				if err != nil {
					fmt.Println("Error awarding prize...")
				}
			} else {
				fmt.Println("Error awarding prize, uid jwt null?")
			}
			h.outboundMessage <- NewPacketUInt8(201, cli)
		} else {
			fmt.Println("NIL CLIENT WON? Might have DC'd before the prize was detected as won.")
		}
		//Ready lets swap the queue
		h.RemoveFromQueue(nil)
	case 1:
		//Lose logic here
		cli := h.queue.GetFrontQueue()
		if cli != nil {
			h.outboundMessage <- NewPacketUInt8(202, cli)
		}
		//Ready lets swap the queue
		h.RemoveFromQueue(nil)
	case 2:
		//Ready lets swap the queue
		//h.RemoveFromQueue(nil)
		//Try to get payment from the person in the front.
		for {
			cli := h.queue.GetFrontQueue()

			if cli != nil {
				//Send the coin token its play time..
				uid, _ := cli.jwtData.GetUserIdAsInt64()
				coinErr := PayTokens(cli.hub.gameData.CoinCost, uid, h.server)
				if coinErr != nil {
					fmt.Printf("Error paying tokens: %v\n", coinErr)
					h.outboundMessage <- NewPacketUInt8(207, h.cabinent)
					h.RemoveFromQueue(nil)
				} else {
					h.outboundMessage <- NewPacketUInt8(7, message.Sender)
					break
				}
			}
			break
		}

	case 205:
		cli := h.queue.GetFrontQueue()
		if cli != nil {
			h.outboundMessage <- NewPacketUInt8(data, cli)
		}
	}
}

func (h *Hub) joinQueue(c *Client) {
	isNew, place := h.queue.AddToQueue(c)
	if !isNew {
		h.qDCTimer.Stop()
		h.outboundMessage <- NewPacketUInt8(place, c)
		return
	}
	if place == 1 {
		//That means queue was idle send ready token.
		if h.cabinent != nil {

			cli := h.queue.GetFrontQueue()
			uid, _ := cli.jwtData.GetUserIdAsInt64()
			coinErr := PayTokens(cli.hub.gameData.CoinCost, uid, h.server)
			if coinErr != nil {
				fmt.Printf("Error paying tokens: %v\n", coinErr)
				h.outboundMessage <- NewPacketUInt8(207, h.cabinent)
				h.RemoveFromQueue(nil)
				return
			} else {
				h.outboundMessage <- NewPacketUInt8(7, h.cabinent)
			}
		}
	}
	h.outboundMessage <- NewPacketUInt8(place, c)
}
