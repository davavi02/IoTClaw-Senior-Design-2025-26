# TODO: Rename program to obsManager.py
#       Ensure that main is calling proper functions and imports

# Manages all OBS scene transitions and text overlay updates for the claw machine.
#
# OBS Setup verification:
#   Scenes (must be named exactly):
#     - "Waiting Screen"  -> shown on game setup with countdown
#     - "Camera 1"        -> default play camera
#     - "Camera 2"        -> play camera
#     - "Camera 3"        -> play camera
#     - "Win Screen"      -> shown when prize is detected
#     - "Loss Screen"     -> shown when no prize detected
#
#   Text Sources (must exist in EVERY scene that displays them, or use a global scene):
#     - "Status Text"     -> displays messages like "Game being set up..." / "Move claw to play"
#     - "Timer Text"      -> displays countdown numbers / empty string when not needed
#
#   How to add shared text across scenes in OBS:
#     Use a shared scene as a source. Create a scene called "HUD" containing
#     "Status Text" and "Timer Text", then add "HUD" as a scene source to each scene.

from obswebsocket import obsws, requests as obsRequests
import time
import threading

OBS_HOST = "localhost"
OBS_PORT = 4455
OBS_PASSWORD = "ywcMzCnkYKGBPSjK"

SCENE_WAITING   = "Waiting Screen"
SCENE_CAMERA_1  = "Camera 1"
SCENE_CAMERA_2  = "Camera 2"
SCENE_CAMERA_3  = "Camera 3"
SCENE_WIN       = "Win Screen"
SCENE_LOSS      = "Loss Screen"

CAMERA_SCENES = [SCENE_CAMERA_1, SCENE_CAMERA_2, SCENE_CAMERA_3]

TEXT_STATUS = "Status Text"
TEXT_TIMER  = "Timer Text"


class OBSManager:
    def __init__(self):
        self.ws = None
        self.current_camera_index = 0

    # ------------------------------------------------------------------ #
    #  Connection
    # ------------------------------------------------------------------ #

    def connect(self):
        self.ws = obsws(OBS_HOST, OBS_PORT, OBS_PASSWORD)
        self.ws.connect()
        print("[OBS] Connected")

    def disconnect(self):
        if self.ws:
            self.ws.disconnect()
            print("[OBS] Disconnected")

    # ------------------------------------------------------------------ #
    #  Helpers
    # ------------------------------------------------------------------ #

    def set_scene(self, scene_name: str):
        self.ws.call(obsRequests.SetCurrentProgramScene(sceneName=scene_name))
        print(f"[OBS] Scene -> {scene_name}")

    def set_text(self, source_name: str, text: str):
        #Update a GDI+ / Freetype text source's content
        self.ws.call(obsRequests.SetInputSettings(
            inputName=source_name,
            inputSettings={"text": text}
        ))
    # ------------------------------------------------------------------ #
    #  Game flow
    # ------------------------------------------------------------------ #

    def toggle_camera(self):
        #Cycle to the next camera scene cycling 1,2,3,1
        self.current_camera_index = (self.current_camera_index + 1) % len(CAMERA_SCENES)
        scene = CAMERA_SCENES[self.current_camera_index]
        self.set_scene(scene)
        print(f"[OBS] Camera toggled -> {scene}")
        return self.current_camera_index