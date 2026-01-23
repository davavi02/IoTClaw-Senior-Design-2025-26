//https://github.com/gorilla/websocket/blob/main/examples/chat/main.go

package main

import (
	"fmt"
)

func main() {
	server := CreateServer()
	if server == nil {
		fmt.Println("Error creating app.")
	} else {
		server.Run("127.0.0.1:20206")
	}
}
