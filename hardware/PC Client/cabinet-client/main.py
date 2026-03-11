# Main websocket client that will rest on the PC
import struct
import asyncio
from websockets.asyncio.client import connect
from toggleCamera import toggleCamera
from dropClawAndDetect import dropClawAndDetect
from moveClaw import moveClaw

ADDRESS = "ws://localhost:8765"
gameActive = False

async def main():
    global gameActive
    while True:
        async with connect(ADDRESS) as websocket:
            async for message in websocket:
                # Unpack binary data and get number
                message = struct.unpack("B", message)[0]
                print(message)

                if gameActive:
                    if message >= 0 and message < 4:
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
