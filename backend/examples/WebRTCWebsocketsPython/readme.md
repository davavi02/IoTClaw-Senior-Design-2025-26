# WebRTC + Websockets Test w/ RPi
The code is based off the webcam.py example from the Python aiortc library [project repository](https://github.com/aiortc/aiortc/tree/main/examples/webcam).
The original code had the webcam and webserver/site component in one program/machine. It only had WebRTC components and basic web files/pages. I had AI seperate them to 2 different programs and add websockets so both programs can communicate through the web.

node.py is a program that runs on a device (claw machine) for showing a webcam. The node then connects via websocket to a specified IP that is for the webserver/cloud and adds the device to a list of nodes. A user also connects to the webserver/cloud and selects a node to view a webcam. The webserver then tells the node and user to create a direct connection via WebRTC. Once established, the user can view the webcam.

There are a few things to take into consideration:
- WebRTC establishes a peer-to-peer connection. Some networks may have some strict networks/firewalls that may not allow peers to connect directly. A way to avoid this is to set up a "relayed connection server" (TURN Server) in the cloud to facilitate the peer-to-peer connection. This can just be a docker container that can be spun up
- This proof of concept uses unsecured connections, so it would be important to have different methods of restrictions to avoid unintended connections. The websockets could be secured in a variety of ways like authentications keys or tokens. In terms of opening ports/port forwarding, the cloud could only be the one opening ports to the public for the website/websocket. The Pi only initiates outbound connections for the websocket, and the WebRTC protocol lets peers find connections through what is allowed in their respective networks. Opening ports on the Pi could make it easier for users to connect but thats a tradeoff to consider.
- The RPi may be limited in the amount of webcams or simultaneous users it allows. We should do a few test to see if the RPi is a realiable way to implement this system. The node.py code can be run on any machine as long as you set the webcams correctly. I was able to run the node.py code on my laptop with a camera and view it. I considered the RPi as WebRTC also allows for a data channel and combining it with the RPi GPIO, we would only need one device on the cabinet and it would be able to control the gantry motherboard. There wouldn't be a need for microcontrollers or other devices.
- The content in webserver.py doesn't need to be run in python, we can port it and adapt it to whatever webserver system we use. As long as our webserver can create Websockets and provide clients with WebRTC information it should work.

This is just a proof-of-concept, there are many things to evaluate if we decide to go with this route, as well as other implementations to look at.

## Running this project
1. Have python3 installed and install pip packages on both the webcam device and the website server:

    `pip install aiortc aiohttp websockets`

    (websockets package may not be needed but just in case)
2. Place webserver.py, index.html, and client.js on the cloud/test server and run the python code:

    `python webserver.py`

    Ensure you have port 8080 open and accessible, the program should start outputting to the console
3. On your webcam device/RPi only place node.py and edit the line with the server IP with the address of your server:

    `CLOUD_SERVER_URL = "ws://CLOUD-IP:8080/ws/register"`

    Then run the python code:

    `python node.py`

    The code only works with Linux out of the box but adjustments can be made for other platforms (check the original example code for more details)

4. Visit the webpage on port 8080 on the cloud/server and start to view the webcam. If your server and node aren't on the same local network, check the "Use STUN" box. If you can't view the webcam from remote connections, there might be a restrictive network and a relay would need to be used like mentioned above.

