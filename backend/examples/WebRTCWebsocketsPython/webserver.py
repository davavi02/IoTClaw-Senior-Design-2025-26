'''

AI GENERATED CODE
USED FOR PROOF OF CONCEPT, REFERENCE ONLY

Python code for the hub running in the cloud. Users and nodes meet here to create direct connections
Derrived from the webcam example of the aiortc GitHub repository

'''
import os
import ssl
import json
import asyncio
import uuid
from aiohttp import web

ROOT = os.path.dirname(__file__)

# This dictionary will store the WebSocket connection for each registered node.
# Format: { "node_id": websocket_object }
connected_nodes = {}

# This dictionary will bridge HTTP requests to WebSocket responses.
# Format: { "request_id": asyncio.Future }
pending_offers = {}

async def get_nodes_api(request: web.Request) -> web.Response:
    """API endpoint for the browser to fetch the list of available nodes."""
    return web.json_response(list(connected_nodes.keys()))

async def node_websocket_handler(request: web.Request) -> web.WebSocketResponse:
    """Handles the persistent WebSocket connection from each Webcam Node."""
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    node_id = None
    try:
        # First message from the node should be its ID
        first_msg = await ws.receive_json()
        node_id = first_msg.get("node_id")
        if not node_id:
            await ws.close(code=1008, message=b'Node ID not provided.')
            return ws

        print(f"Node '{node_id}' connected.")
        connected_nodes[node_id] = ws

        # Listen for messages (answers) from the node
        async for msg in ws:
            if msg.type == web.WSMsgType.TEXT:
                data = json.loads(msg.data)
                request_id = data.get("request_id")
                if request_id in pending_offers:
                    # Set the result for the waiting HTTP handler
                    pending_offers[request_id].set_result(data)

    except Exception as e:
        print(f"Error with node '{node_id}': {e}")
    finally:
        if node_id and node_id in connected_nodes:
            print(f"Node '{node_id}' disconnected.")
            del connected_nodes[node_id]

    return ws

async def offer(request: web.Request) -> web.Response:
    """
    Handles the offer from the browser, finds the correct node,
    and proxies the request over a WebSocket.
    """
    node_id = request.match_info["node_id"]
    if node_id not in connected_nodes:
        return web.Response(status=404, text=f"Node '{node_id}' not found or is not online.")

    browser_offer = await request.json()
    request_id = str(uuid.uuid4()) # Unique ID for this transaction

    # Create a Future to wait for the answer from the node
    future = asyncio.get_running_loop().create_future()
    pending_offers[request_id] = future

    try:
        # Send the offer to the node via WebSocket
        node_ws = connected_nodes[node_id]
        await node_ws.send_json({
            "type": "offer",
            "request_id": request_id,
            "payload": browser_offer
        })

        # Wait for the node to send back an answer (max 10 seconds)
        answer_payload = await asyncio.wait_for(future, timeout=10)
        return web.json_response(answer_payload["payload"])

    except asyncio.TimeoutError:
        return web.Response(status=504, text="Request timed out. Node did not respond.")
    except Exception as e:
        return web.Response(status=500, text=f"An error occurred: {e}")
    finally:
        # Clean up the pending offer
        if request_id in pending_offers:
            del pending_offers[request_id]

async def index(request: web.Request) -> web.Response:
    content = open(os.path.join(ROOT, "index.html"), "r").read()
    return web.Response(content_type="text/html", text=content)

async def javascript(request: web.Request) -> web.Response:
    content = open(os.path.join(ROOT, "client.js"), "r").read()
    return web.Response(content_type="application/javascript", text=content)

# --- Main Setup ---
app = web.Application()
app.router.add_get("/", index)
app.router.add_get("/client.js", javascript)
app.router.add_get("/api/nodes", get_nodes_api)
app.router.add_get("/ws/register", node_websocket_handler)
app.router.add_post("/offer/{node_id}", offer)

web.run_app(app, host="0.0.0.0", port=8080)