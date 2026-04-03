//https://github.com/gorilla/websocket/blob/main/examples/chat/hub.go

// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import "fmt"

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
	}
}

func (h *Hub) run() {

	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			if client.isCabinent {
				h.cabinent = client
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				//Removes client.
				h.RemoveFromQueue(client)
				delete(h.clients, client)
				close(client.send)

				if client.isCabinent {
					h.cabinent = nil
				}
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

	if data >= 0 && data <= 6 {
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
		data += 1
		for x, _ := range h.clients {
			h.outboundMessage <- NewPacketUInt8(124, x)
		}
	case 1:
		//Lose logic here
		data += 1
	case 2:
		//Ready lets swap the queue
		h.RemoveFromQueue(nil)
		cli := h.queue.GetFrontQueue()
		if cli != nil {
			//Send the coin token its play time..
			uid, _ := cli.jwtData.GetUserIdAsInt64()
			coinErr := PayTokens(cli.hub.gameData.CoinCost, uid, h.server)
			if coinErr != nil {
				fmt.Printf("Error paying tokens: %v\n", coinErr)
			}
			h.outboundMessage <- NewPacketUInt8(7, message.Sender)
		}
	}
}

func (h *Hub) joinQueue(c *Client) {
	_, place := h.queue.AddToQueue(c)
	h.outboundMessage <- NewPacketUInt8(place, c)
	if place == 1 {
		//That means queue was idle send ready token.
		if h.cabinent != nil {

			cli := h.queue.GetFrontQueue()
			uid, _ := cli.jwtData.GetUserIdAsInt64()
			coinErr := PayTokens(cli.hub.gameData.CoinCost, uid, h.server)
			if coinErr != nil {
				fmt.Printf("Error paying tokens: %v\n", coinErr)
			}
			h.outboundMessage <- NewPacketUInt8(7, h.cabinent)
		}
	}
}
