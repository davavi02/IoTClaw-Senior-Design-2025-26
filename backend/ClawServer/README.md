This is supposed to represent the backend server of the application.
This is a decently modified chat example from the gorilla/websockets library


# Notes on setup
If using locally uncomment and swap line 32 and 33. One uses https and the other uses http. 

## Routes
API routes are found in main.go
I setup two different routes, one for the cabinent and one for clients (users)
Its also password protected in the URI and i made the passwords for each passing in the parameters on line 11 in main.go
Example connection ws url: "ws://garlicpos.com/cab1/cab?passcode=cab1122!!@@"

## Hubs
Hubs are a websocket instance that handles the concurrent connections to clients. Think of this a webscoket server per arcade machnine
If we wanted multiple cabinent support we just create multiple hub objects and http endpoints for each, to support arbitrary numbers of cabinenets.

function newHub(string cabPass, string clinetPass) found in the Hub.go creates a hub
funtion run() should be run in a go routine (think thread). it waits for events on the streams and handles events like messages/disconnects etc.

# REST APIS
I wrote a example of what a rest api handler would look like in main.go since we will e using those alot for the reactnative/server comms
The function to actually do the handle (cabHub1.getUser) doesn't exist. I just wanted to show a exmaple of what a rest api endpoint would look like.

# Serving HTML
I didnt include it, since I felt it unneccesary. It can be added, but since our clients are React Native applications we wont be needing to unless we wanted a like a debug or admin panel or a non react native web client.

# GO Setup

## Install go
Google how to do it, im tired of typing.

## Install dependancys
Run the command in the directory:
go mod tidy

## Building
Run the command in the directory:
go mod build
You should now see the output executable with the name ClawServer