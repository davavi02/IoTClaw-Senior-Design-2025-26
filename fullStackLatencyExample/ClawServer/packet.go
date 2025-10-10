package main

import "github.com/gorilla/websocket"

type Packet struct {
	Data       []byte
	Sender     *Client
	PacketType int
}

func (p *Packet) GetMessage() string {
	if p.PacketType == websocket.TextMessage {
		return string(p.Data)
	}
	return ""
}

func CreatePacket(data []byte, sender *Client, packetType int) *Packet {
	return &Packet{
		Data:       data,
		Sender:     sender,
		PacketType: packetType,
	}
}
