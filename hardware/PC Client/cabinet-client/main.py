# Main websocket client that will rest on the PC
import struct
import asyncio
import requests
import time
import threading
from websockets.asyncio.client import connect
from toggleCamera import toggleCamera
from dropClawAndDetect import dropClawAndDetect
from moveClaw import moveClaw

REQUEST_MESSAGE = '{"name": "The-Claw", "password":"1234567890"}'
request = requests.post("http://html-server.babid.net:20206/api/creategame", data=REQUEST_MESSAGE)
print(request.text)
ADDRESS = "ws://localhost:8765" #Local testing
#ADDRESS = "ws://html-server.babid.net:20206/api/join/The-Claw"
# Temporary until backend token receival working 
JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaXNBZG1pbiI6ZmFsc2UsImlzR2FtZSI6dHJ1ZSwidW5pcXVlSWQiOiI1YTZmMmRjYS0yYmU1LTRkOGMtYjg1OS1lOTkwNzY0ZWNhMzEiLCJleHAiOjE3NzM4MTU5MDh9.pl1MJSoUEok_HL9ViZJJidUZkSzJ8dvrpu5rHEVesz4"
#headers = {"Authorization": f"Bearer {JWT}"}
headers = None #Local testing

class Events:
    time = 0
    active = False
    status = 0
game = Events()

def timerManager(timer_var, length, ws):
    timer_var.time = length
    while timer_var.time > 0 and game.active:
        print(timer_var.time)
        # Message to OBS to update timer here?
        time.sleep(1)
        timer_var.time -= 1
    if timer_var.active:
        timer_var.active = False
        print("Timer ran out, checking for prize...")
        dropClawAndDetect(timer_var, ws)


async def messageReceived(websocket):
    global game
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
                        detect_thread = threading.Thread(target=dropClawAndDetect, args=(websocket, game))
                        detect_thread.start()
                elif message == 6:
                    # Change to thread approach
                    asyncio.create_task(toggleCamera())
                else:
                    if message == 7 and game.status == 0:
                        game.active = True
                        game.status == 1
                        print("Starting Game")
                        move_thread = threading.Thread(target=moveClaw, args=(message,))
                        move_thread.start()
                        timer_thread = threading.Thread(target=timerManager, args=(game, 30, websocket))
                        timer_thread.start()

async def main():
    while True:
        try:
            async with connect(ADDRESS, additional_headers=headers) as websocket:
                asyncio.create_task(messageReceived(websocket))
                # Possibly add code for sending other messages here?
        except:
            pass


# TODO: Ensure socket doesn't disconnect due to timeout
if __name__ == "__main__":
    asyncio.run(main())
