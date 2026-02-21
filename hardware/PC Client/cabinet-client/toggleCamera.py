# This application talks to OBS to do so

import asyncio
from obswebsocket import obsws, requests

#TODO on Computer pip install obs-websocket-py
#Set proper OBS host, port, and password
OBS_HOST = "localhost"
OBS_PORT = 4455
OBS_PASSWORD = "password_here"

# Cycle through camera views
# TODO ensure scenes in obs are labeled exactly same as in program
SCENES = ["Camera 1", "Camera 2", "Camera 3"]
current_index = 0

async def toggleCamera():
    global current_index

    # Connect to OBS
    ws = obsws(OBS_HOST, OBS_PORT, OBS_PASSWORD)
    ws.connect()

    # Cycle to next camera limited to 3
    current_index = (current_index + 1) % len(SCENES)
    scene_name = SCENES[current_index]

    ws.call(requests.SetCurrentProgramScene(sceneName=scene_name))
    print(f"Switched to: {scene_name}")

    #ws.disconnect() incase we need to disconnect the websocket for OBS?