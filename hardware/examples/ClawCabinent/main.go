//https://tradermade.com/tutorials/golang-websocket-client
//Modifying example found above^

//"github.com/andreykaipov/goobs"
//client connection example from above

package main

import (
	"log"
	"os"
	"os/signal"
	"time"

	"github.com/andreykaipov/goobs"
	"github.com/andreykaipov/goobs/api/requests/scenes"
	"github.com/gorilla/websocket"
)

func GetSceneName(next bool) string {
	if next {
		return "1"
	}
	return "2"
}

func main() {

	client, err := goobs.New("localhost:4455", goobs.WithPassword("1234qwer"))
	if err != nil {
		panic(err)
	}
	defer client.Disconnect()

	version, err := client.General.GetVersion()
	if err != nil {
		panic(err)
	}

	isSceneOne := true

	log.Printf("OBS Studio version: %s\n", version.ObsVersion)
	log.Printf("Server protocol version: %s\n", version.ObsWebSocketVersion)
	log.Printf("Client protocol version: %s\n", goobs.ProtocolVersion)
	log.Printf("Client library version: %s\n", goobs.LibraryVersion)
	log.Printf("Obs connection success.")

	x := &scenes.SetCurrentProgramSceneParams{}

	_, err = client.Scenes.SetCurrentProgramScene(x.WithSceneName(GetSceneName(isSceneOne)))
	if err != nil {
		log.Fatal("Error happened with obs.")
	}

	//Create Message Out
	messageOut := make(chan string)
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)
	url := "wss://garlicpos.com/cab1/cab?passcode=cab1122!!@@"
	log.Printf("connecting to %s", url)
	c, resp, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		log.Printf("handshake failed with status %d", resp.StatusCode)
		log.Fatal("dial:", err)
	}

	log.Printf("status %d", resp.StatusCode)

	//When the program closes close the connection
	defer c.Close()
	done := make(chan struct{})
	go func() {
		defer close(done)
		for {
			log.Println("called")

			_, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				return
			}
			log.Printf("recv: %s", message)
			if string(message) == "On" {
				log.Println("msg rcv: ", message)

				_, err = client.Scenes.SetCurrentProgramScene(x.WithSceneName(GetSceneName(false)))
				if err != nil {
					log.Fatal("Error happened with obs.")
				}
			}

			if string(message) == "Off" {
				log.Println("msg rcv: ", message)

				det, err := client.Scenes.SetCurrentProgramScene(x.WithSceneName(GetSceneName(true)))
				if err != nil {
					log.Fatal("Error happened with obs.")
				}
				det.GetRaw()
			}
		}

	}()

	for {
		select {
		case <-done:
			return
		case m := <-messageOut:
			log.Printf("Send Message %s", m)
			err := c.WriteMessage(websocket.TextMessage, []byte(m))
			if err != nil {
				log.Println("write:", err)
				return
			}
		case <-interrupt:
			log.Println("interrupt")
			// Cleanly close the connection by sending a close message and then
			// waiting (with timeout) for the server to close the connection.
			err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				log.Println("write close:", err)
				return
			}
			select {
			case <-done:
			case <-time.After(time.Second):
			}
			return
		}
	}
}
