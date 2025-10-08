'''

AI GENERATED CODE
USED FOR PROOF OF CONCEPT, REFERENCE ONLY

Python code for a camera node that connects to the cloud server
Derrived from the webcam example of the aiortc GitHub repository

'''
import asyncio
import json
import logging
import platform
import argparse
from aiohttp import web, ClientSession
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer, MediaRelay

# Node connection data
NODE_ID = "pi-test"
CLOUD_SERVER_URL = "ws://CLOUD-IP:8080/ws/register"

relay = None
webcam = None
pcs = set()

def create_local_tracks():
    global relay, webcam
    if relay is None:
        options = {"framerate": "30", "video_size": "640x480"}
        webcam = MediaPlayer("/dev/video0", format="v4l2", options=options)
        relay = MediaRelay()
    return relay.subscribe(webcam.video)

async def process_offer(offer_data):
    """The core aiortc logic, triggered by a WebSocket message."""
    offer = RTCSessionDescription(sdp=offer_data["sdp"], type=offer_data["type"])
    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        print("Connection state is %s" % pc.connectionState)
        if pc.connectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    video_track = create_local_tracks()
    pc.addTrack(video_track)

    await pc.setRemoteDescription(offer)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    return {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}

async def run_node():
    """Connects to the cloud server and listens for commands."""
    while True:
        try:
            async with ClientSession() as session:
                async with session.ws_connect(CLOUD_SERVER_URL) as ws:
                    # 1. Register with the server
                    await ws.send_json({"node_id": NODE_ID})
                    print(f"Connected to cloud server as '{NODE_ID}'")

                    # 2. Listen for incoming offers
                    async for msg in ws:
                        if msg.type == web.WSMsgType.TEXT:
                            data = json.loads(msg.data)
                            if data.get("type") == "offer":
                                print("Received offer, generating answer...")
                                request_id = data["request_id"]
                                answer_payload = await process_offer(data["payload"])
                                # 3. Send the answer back
                                await ws.send_json({
                                    "type": "answer",
                                    "request_id": request_id,
                                    "payload": answer_payload
                                })
                                print("Answer sent.")
        except Exception as e:
            print(f"Connection failed: {e}. Retrying in 5 seconds...")
            await asyncio.sleep(5)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    try:
        asyncio.run(run_node())
    except KeyboardInterrupt:
        pass
