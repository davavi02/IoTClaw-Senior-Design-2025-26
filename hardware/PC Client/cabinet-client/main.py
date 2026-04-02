# Main websocket client that will rest on the PC
import struct
import requests
import time
import threading, queue
from websockets.sync.client import connect
from dropClawAndDetect import dropClawAndDetect
from moveClaw import moveClaw
from obsmanager import *

REQUEST_MESSAGE = '{"name": "The-Claw", "password":"1234567890"}'
request = requests.post("http://html-server.babid.net:20206/api/creategame", data=REQUEST_MESSAGE)
JWT = request.text.strip().rsplit('"')[-2]
print("JWT:", JWT)
ADDRESS = "ws://html-server.babid.net:20206/api/join/The-Claw"
headers = {"Authorization": f"Bearer {JWT}"}
#ADDRESS = "ws://localhost:8765" #Local testing
#headers = None #Local testing

class Events:
    time = 0
    active = False
    status = 0
    movement = False
game = Events()
messages = queue.Queue()
obs = OBSManager()

def timerManager(game, length):
    game.time = length
    while game.time > 0 and game.active:
        print("Timer", game.time)
        if game.time > 15:
            obs.set_text("Timer Text", "View Time: " + str(game.time - 15))
        else:
            obs.set_text("Timer Text", "Play Time: " + str(game.time))
        if game.time == 15:
            messages.put(205)
            game.movement = True
        time.sleep(1)
        game.time -= 1
    obs.set_text("Timer Text", "Timer: " + str(0))
    if game.active:
        game.active = False
        print("Timer ran out, checking for prize...")
        moveClaw()
        dropClawAndDetect(messages, game)


def parseMessages(websocket):
    global game, messages
    for message in websocket:
                # Unpack binary data and get number
                message = struct.unpack("B", message)[0]
                print(message)
                if game.active and game.movement:
                    if message >= 0 and message <= 4:
                        move_thread = threading.Thread(target=moveClaw, args=(message,))
                        move_thread.start()
                    elif message == 5:
                        game.active = False
                        print("Ending game, checking for prize...")
                        detect_thread = threading.Thread(target=dropClawAndDetect, args=(messages, game))
                        detect_thread.start()
                    elif message == 6:
                        obs.toggle_camera()
                elif message == 6:
                    obs.toggle_camera()
                else:
                    if message == 7 and game.status == 0 and game.active == False:
                        game.active = True
                        game.status == 1
                        print("Starting Game")
                        move_thread = threading.Thread(target=moveClaw, args=(message,))
                        move_thread.start()
                        timer_thread = threading.Thread(target=timerManager, args=(game, 25))
                        timer_thread.start()

def sendMessages(websocket, messages):
    while True:        
        if list(messages.queue):
            print("Messages:", list(messages.queue))
            message = messages.get()
            message = struct.pack("B", message)
            websocket.send(message, text=False)
            print("Sent:", message)
            if message == 1 or message == 0:
                time.sleep(3)
                message = struct.pack("B", int(2))
                websocket.send(message, text=False)
                print("Sent:", message)

def main():
    while True:
        try:
            print(headers)
            with connect(ADDRESS, additional_headers=headers) as websocket:
                msg_t = threading.Thread(target=sendMessages, args=(websocket, messages))
                msg_t.start()
                parseMessages(websocket)
        except Exception as e:
            print("Something happened with websocket, retrying in 8s:", e)
            time.sleep(8)


# TODO: Ensure socket doesn't disconnect due to timeout
if __name__ == "__main__":
    obs.connect()
    main()