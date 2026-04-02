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
        #self._timer_thread = None
        #self._timer_stop = threading.Event()

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

    def stop_timer(self):
        #Signal any running countdown thread to stop
        self._timer_stop.set()
        if self._timer_thread and self._timer_thread.is_alive():
            self._timer_thread.join(timeout=2)
        self._timer_stop.clear()

    # ------------------------------------------------------------------ #
    #  Game flow
    # ------------------------------------------------------------------ #

    def show_waiting_screen(self, on_complete_callback=None):
    # ------------------------------------------------------------------ #
    #   Switch to Waiting Screen, display setup message, count down 10 s,
    #   then call on_complete_callback (if provided) when finished.
    #   Runs the countdown on a background thread so it doesn't block asyncio.
    # ------------------------------------------------------------------ #
        self.stop_timer()
        self.set_scene(SCENE_WAITING)
        self.set_text(TEXT_STATUS, "Game being set up, please wait")
        self.set_text(TEXT_TIMER, "10")

        def _countdown():
            for remaining in range(10, 0, -1):
                if self._timer_stop.is_set():
                    return
                self.set_text(TEXT_TIMER, str(remaining))
                time.sleep(1)
            if not self._timer_stop.is_set():
                self.set_text(TEXT_TIMER, "")
                if on_complete_callback:
                    on_complete_callback()

        self._timer_thread = threading.Thread(target=_countdown, daemon=True)
        self._timer_thread.start()

    def show_camera_ready(self):
    # ------------------------------------------------------------------ #
    #   Switch to Camera 1 with 'Move claw to play' prompt.
    #   Called after the waiting-screen countdown finishes.
    # ------------------------------------------------------------------ #
        self.current_camera_index = 0
        self.set_scene(SCENE_CAMERA_1)
        self.set_text(TEXT_STATUS, "Move claw to play")
        self.set_text(TEXT_TIMER, "")

    def stop_play_timer(self):
        #Halt the running play timer when drop is triggered manually
        self.stop_timer()
        self.set_text(TEXT_TIMER, "")

    def toggle_camera(self):
        #Cycle to the next camera scene cycling 1,2,3,1
        self.current_camera_index = (self.current_camera_index + 1) % len(CAMERA_SCENES)
        scene = CAMERA_SCENES[self.current_camera_index]
        self.set_scene(scene)
        print(f"[OBS] Camera toggled -> {scene}")

    def show_result_screen(self, won: bool):
    # ------------------------------------------------------------------ #
    #   Stop any running timer and switch to Win or Loss scene.
    #   TODO: Update prize detection with true/false if able
    #   won=True  -> Win Screen
    #   won=False -> Loss Screen
    # ------------------------------------------------------------------ #
        self.stop_timer()
        self.set_text(TEXT_TIMER, "")
        if won:
            self.set_scene(SCENE_WIN)
            self.set_text(TEXT_STATUS, "You won a prize!")
        else:
            self.set_scene(SCENE_LOSS)
            self.set_text(TEXT_STATUS, "Better luck next time!")
        print(f"[OBS] Result screen -> {'Win' if won else 'Loss'}")