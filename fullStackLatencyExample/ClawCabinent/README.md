# Example Golang Cabinent Applicaiton
This example is a modified example of a websocket server found here:
//https://tradermade.com/tutorials/golang-websocket-client

The goobs (go obs) setup was really easy.

# OBS Setup. 

## Download OBS Version 28+ 
https://github.com/obsproject/obs-studio/releases/

## Create scenes 1 & 2
This example requires two scenes in obs named "1" and "2" without quotes.

## Whip setup.
I setup whip by going to: File -> Settings -> Stream
    -Service -> Set to WHIP
    -Server -> Set to the mediamtx server (in my instance): http://34.174.86.125:8889/claw1/whip
    -Bearer Token -> username:password
    (since I setup mediamtx to require username/password to view/start streams see parent directory for setup)

## Websocket Setup:
I setup obs websocket server by going to: Tools -> Websocket Server Settings
    -Plugin settings -> Enable Websocket Server
    -Server Settings -> Port 4455
    -Server Settings -> Password I used: 1234qwer

    ENSURE THIS MATCHES LINE 29 in main.go otherwise there will be a error.



# Websocket server connection
Since the obs connection is handled this is how you connect to the backend websocket server

On line 59 in main.go: I define a variable named url.
In this constructor I pass the websocket information that the cabinent connects to.
See: The ClawServer folder in the directory above.
Note: I used my domain garlicpos.com when I deployed this for the test. Change this to whereever the server is runnning.
Note on wss: I did use https for this connection as it was deployed, odds are you might need to change to ws: in the url if you are not using https

It only responds to On and Off string messages.


# Compile

##install go
Google it.... im tired of typing.

##Install dependencys
Run the command: go mod tidy

This will install the packages defined in the go.mod

##Compile 
Run the command: go mod build

There should now be a executable in this directory. Run it on the cabinent machine thats also running obs.

# Final Notes:

I don't like the way this is setup. Goobs api is awkwardly written.
My personal suggestiong is to scrap this in favor of python. Suggestions from me googling:

Python 3.7+ (Asyncio): simpleobsws by IRLToolkit
https://websockets.readthedocs.io/en/stable/intro/examples.html

Looks cleaner to me. Up to the hardware team.