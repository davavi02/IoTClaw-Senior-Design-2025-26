//https://github.com/gorilla/websocket/blob/main/examples/chat/main.go

package main

import (
	"fmt"
)

func generateTestJWT() {
	for i := 0; i < 4; i++ {
		token, err := createToken(int64(i), false, false)
		if err != nil {
			return
		}
		fmt.Printf("Token #%v: %v\n", i, token)
	}
	token, err := createToken(int64(0), false, true)
	if err != nil {
		return
	}
	fmt.Printf("Cab Token: %v\n", token)
}

func main() {
	server := CreateServer()
	if server == nil {
		fmt.Println("Error creating app.")
	} else {
		generateTestJWT()
		defer server.dbMan.db.Close()
		server.Run(":20206")
	}
}
