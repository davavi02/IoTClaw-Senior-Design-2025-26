# Main websocket client that will rest on the PC
import struct
import asyncio
import requests
from websockets.asyncio.client import connect
from toggleCamera import toggleCamera
from dropClawAndDetect import dropClawAndDetect
from moveClaw import moveClaw

REQUEST_MESSAGE = '{"name": "The-Claw", "password":"1234567890"}'
request = requests.post("http://html-server.babid.net:20206/api/creategame", data=REQUEST_MESSAGE)
print(request.text)
#ADDRESS = "ws://localhost:8765" #Local testing
ADDRESS = "ws://html-server.babid.net:20206/api/join/The-Claw"
# Temporary until backend token receival working 
JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaXNBZG1pbiI6ZmFsc2UsImlzR2FtZSI6dHJ1ZSwidW5pcXVlSWQiOiI1YTZmMmRjYS0yYmU1LTRkOGMtYjg1OS1lOTkwNzY0ZWNhMzEiLCJleHAiOjE3NzM4MTU5MDh9.pl1MJSoUEok_HL9ViZJJidUZkSzJ8dvrpu5rHEVesz4"
gameActive = False
headers = {"Authorization": f"Bearer {JWT}"}
async def main():
    global gameActive
    while True:
        async with connect(ADDRESS, additional_headers=headers) as websocket:
            async for message in websocket:
                # Unpack binary data and get number
                message = struct.unpack("B", message)[0]
                print(message)
                # TODO: Implement timer
                if gameActive:
                    if message >= 0 and message <= 4:
                        asyncio.create_task(moveClaw(message))
                    elif message == 5:
                        gameActive = False
                        print("Ending game, checking for prize...")
                        if await dropClawAndDetect():
                            print("Prize won")
                        else:
                            print("No prize")
                elif message == 6:
                    asyncio.create_task(toggleCamera())
                else:
                    if message == 7:
                        gameActive = True
                        print("Starting Game")
                        await moveClaw(message)



# TODO: Ensure socket doesn't disconnect due to timeout
if __name__ == "__main__":
    asyncio.run(main())
