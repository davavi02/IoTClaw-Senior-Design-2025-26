# Main websocket client that will rest on the PC
import struct
import asyncio
import requests
import time
import threading, queue
from websockets.asyncio.client import connect
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

obs = OBSManager()
class Events:
    time = 0
    active = False
    status = 0
game = Events()
messages = queue.Queue()

def timerManager(timer_var, length):
    timer_var.time = length
    while timer_var.time > 0 and game.active:
        print(timer_var.time)
        # Message to OBS to update timer here?
        obs.set_text("Timer Text", "Timer: " + str(timer_var.time))
        time.sleep(1)
        timer_var.time -= 1
    obs.set_text("Timer Text", "Timer: " + str(0))
    if timer_var.active:
        timer_var.active = False
        print("Timer ran out, checking for prize...")
        dropClawAndDetect(messages, timer_var)


async def messageReceived(websocket):
    global game, messages
    async for message in websocket:
                # Unpack binary data and get number
                message = struct.unpack("B", message)[0]
                print(message)
                if game.active:
                    if message >= 0 and message <= 4:
                        move_thread = threading.Thread(target=moveClaw, args=(message,))
                        move_thread.start()
                    elif message == 5:
                        game.active = False
                        print("Ending game, checking for prize...")
                        detect_thread = threading.Thread(target=dropClawAndDetect, args=(messages, game))
                        detect_thread.start()
                        message = struct.pack("B", 2)
                        time.sleep(15)
                        print("2 sent")
                        await websocket.send(message, text=False)
                    elif message == 6:
                        asyncio.create_task(obs.toggle_camera())
                elif message == 6:
                    asyncio.create_task(obs.toggle_camera())
                else:
                    if message == 7 and game.status == 0 and game.active == False:
                        game.active = True
                        game.status == 1
                        print("Starting Game")
                        move_thread = threading.Thread(target=moveClaw, args=(message,))
                        move_thread.start()
                        timer_thread = threading.Thread(target=timerManager, args=(game, 15))
                        timer_thread.start()

async def sendMessages(websocket, messages):
    # while True:        
        if list(messages.queue):
            print("Messages:", list(messages.queue))
            message = messages.get()
            if message == 2:
                time.sleep(3)
            message = struct.pack("B", message)
            websocket.send(message, text=False)

async def main():
    while True:
        try:
            print(headers)
            async with connect(ADDRESS, additional_headers=headers) as websocket:
                #sendMessages(websocket, messages)
                # msg_t = threading.Thread(target=sendMessages, args=(websocket, messages))
                # msg_t.start()
                await messageReceived(websocket)
                #print("Loop")
                #await sendMessages(websocket)
        except Exception as e:
            print(e)
            print("Something happened with websocket, retrying in 3")
            time.sleep(8)


# TODO: Ensure socket doesn't disconnect due to timeout
if __name__ == "__main__":
    obs.connect()
    asyncio.run(main())
