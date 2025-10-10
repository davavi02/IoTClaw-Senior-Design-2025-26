//https://github.com/gorilla/websocket/blob/main/examples/chat/hub.go

// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

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

	//Cabinent
	cabinent *Client

	//PAsscode for a client..
	ClientPasscode string

	//if this is passed then we know it was the cabinent..
	CabPasscode string
}

func newHub(cabCode string, clientCode string) *Hub {
	return &Hub{
		broadcast:      make(chan *Packet),
		register:       make(chan *Client),
		unregister:     make(chan *Client),
		clients:        make(map[*Client]bool),
		ClientPasscode: clientCode,
		CabPasscode:    cabCode,
		cabinent:       nil,
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
				continue //Dont care for now, cabinent in test is just a dummy
			}
			select {
			case h.cabinent.send <- message:
			default:
				close(h.cabinent.send)
				delete(h.clients, h.cabinent)
				h.cabinent = nil
			}
		}
	}
}
