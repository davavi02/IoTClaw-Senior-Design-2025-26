package main

import (
	"sync"
	"time"
)

type Queue struct {
	mutex          sync.RWMutex
	QueueMap       map[string]*Client
	JWTClientQueue []string
}

func CreateQueue() *Queue {
	return &Queue{
		QueueMap:       make(map[string]*Client),
		JWTClientQueue: make([]string, 0),
	}
}

func (q *Queue) GetFrontQueue() *Client {
	if len(q.JWTClientQueue) > 0 {
		key := q.JWTClientQueue[0]
		val, exist := q.QueueMap[key]
		if exist {
			return val
		}
	}
	return nil
}

// False means already was in queue and was dcd. stop the timer if so
func (q *Queue) AddToQueue(cli *Client) (bool, uint8) {
	q.mutex.Lock()
	defer q.mutex.Unlock()

	id := cli.jwtData.UserId

	//If they are in the queue already, maybe disconnected.
	_, exists := q.QueueMap[id]
	if exists {
		q.QueueMap[id] = cli

		for i, queuedID := range q.JWTClientQueue {
			if queuedID == id {
				return false, (uint8((i + 1)))
			}
		}
	}

	q.JWTClientQueue = append(q.JWTClientQueue, id)
	q.QueueMap[id] = cli

	return true, uint8(len(q.JWTClientQueue))
}

// Pass nil to remove the front. trying to save time.
func (h *Hub) RemoveFromQueue(cli *Client) (isNull bool) {
	q := h.queue
	q.mutex.Lock()
	defer q.mutex.Unlock()

	if cli == nil {
		if len(q.JWTClientQueue) > 0 {
			removedId := q.JWTClientQueue[0]
			q.JWTClientQueue = q.JWTClientQueue[1:]
			delete(q.QueueMap, removedId)
			//Update position numbers:
			for x := 0; x < len(q.JWTClientQueue); x += 1 {
				cli := q.QueueMap[q.JWTClientQueue[x]]
				h.outboundMessage <- NewPacketUInt8(uint8(x+1), cli)
			}
		}
		h.qDCTimer.Stop()
		return false
	}

	id := cli.jwtData.UserId

	_, exists := q.QueueMap[id]
	if exists {
		//Checking if first otherwise we can boot em, first is special cause we want to dc em but not remove in case they reconnect
		if cli == q.QueueMap[q.JWTClientQueue[0]] {
			//First.
			q.QueueMap[id] = nil
			h.qDCTimer.Reset(time.Minute)
			return true
		} else {
			for i, queuedID := range q.JWTClientQueue {
				if queuedID == cli.jwtData.UserId {
					q.JWTClientQueue = append(q.JWTClientQueue[:i], q.JWTClientQueue[i+1:]...)
					delete(q.QueueMap, id)
					for x := i; x < len(q.JWTClientQueue); x += 1 {
						cli := q.QueueMap[q.JWTClientQueue[x]]
						h.outboundMessage <- NewPacketUInt8(uint8(x), cli)
					}
				}
			}
		}
	}
	return false
}
