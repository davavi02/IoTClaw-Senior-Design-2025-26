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
#Local testing
#ADDRESS = "ws://localhost:8765" 
#headers = None

class Events:
    time = 0
    active = False
    movement = False
game = Events()
messages = queue.Queue()
obs = OBSManager()

def timerManager(game, length, messages):
    game.time = length
    while game.time > 0:
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
    obs.set_text("Timer Text", "Play Time: " + str(0))
    game.movement = False
    print("Ending game, checking for prize...")
    dropClawAndDetect(messages)

def parseMessages(websocket):
    global game, messages
    for message in websocket:
                # Unpack binary data and get number
                message = struct.unpack("B", message)[0]
                print(message)
                if message == 6:
                    obs.toggle_camera()
                elif message == 7 and not game.active:
                    game.active = True
                    print("Starting Game")
                    move_thread = threading.Thread(target=moveClaw, args=(message,))
                    move_thread.start()
                    timer_thread = threading.Thread(target=timerManager, args=(game, 25, messages))
                    timer_thread.start()
                elif game.movement and game.active:
                    if message >= 0 and message <= 4:
                        move_thread = threading.Thread(target=moveClaw, args=(message,))
                        move_thread.start()
                    elif message == 5:
                        game.movement = False
                        game.time = 0

def sendMessages(websocket, game, messages):
    while True:        
        if list(messages.queue):
            print("Messages:", list(messages.queue))
            originalMsg = messages.get()
            message = struct.pack("B", originalMsg)
            websocket.send(message, text=False)
            print("Sent:", originalMsg)
            if originalMsg == 1 or originalMsg == 0:
                time.sleep(3)
                game.active = False
                message = struct.pack("B", int(2))
                websocket.send(message, text=False)
                print("Sent: 2")

def main():
    while True:
        try:
            print(headers)
            with connect(ADDRESS, additional_headers=headers) as websocket:
                msg_t = threading.Thread(target=sendMessages, args=(websocket, game, messages))
                msg_t.start()
                parseMessages(websocket)
        except Exception as e:
            print("Something happened with websocket, retrying in 8s:", e)
            time.sleep(8)

if __name__ == "__main__":
    obs.connect()
    main()