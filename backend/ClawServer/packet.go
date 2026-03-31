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

func NewPacketUInt8(val uint8, cli *Client) *Packet {
	return &Packet{
		Data:       []byte{val},
		Sender:     cli,
		PacketType: websocket.BinaryMessage,
	}
}

// bool if true = err
func (p *Packet) GetPacketData() (uint8, bool) {
	if p.PacketType != websocket.BinaryMessage {
		return 0, true
	}

	if len(p.Data) == 0 {
		return 0, true
	}
	return p.Data[0], false
}
