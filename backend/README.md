# MEDIAMTX SETUP
Since I used media mtx to handle the stream it doesnt have a folder as it is simple.

## Download mediamtx
https://github.com/bluenviron/mediamtx/releases

## Setup
I used the configurations mediamtx.yml provided in this folder.
On the vps run mediamtx: 
./mediamtx
Done. The endpoints and user/pass settings are in the yml file change as required.
Honestly should setup systemctl but im tired of typing this stuff without glasses.


# /ClawCabinent 
Contains a go program that handles the communication to obs and websockets to the webserver. This should run on the cabinent pc.

# /ClawServer 
Contains a go program that is a webserver that has endpoints for the websocket communication

It uses go routines and supports concurrent connections between clients/hubs (hubs being per arcade machine)

This setup with small work, can support a ""any"" number of cabinent machines as we just create another hub and endpoint.

That said we should make dynamic endpoints instead of fixed ones in the example. Just wanted to show the work isnt THAT harder here.

# /RNLatencyTest
Using react native and zustand for state management. Is merely a button that firsts connects to a websocket and if sucessful changes to another button to send on/off messages to the webserver.


