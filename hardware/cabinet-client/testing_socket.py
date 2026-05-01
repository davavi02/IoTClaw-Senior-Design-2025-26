# Edited from getting started sample from websockets docs
# Creates and runs a websocket server and asks for data to send through the websocket
import struct
import asyncio
from websockets.asyncio.server import serve


async def echo(websocket):
    # Send a binary frame of data with uint8 instead of a text frame
    message = input("Message (Numbers only 0-255): ")
    while True:
        try:
            message = int(message)
            if message < 0 or message > 255:
                raise ValueError("")
            message = struct.pack("B", message)
            break
        except:
            print("Not a valid number")
            message = input("Try again: ")
            
    await websocket.send(message, text=False)
    print("Message sent")

async def main():
    async with serve(echo, "localhost", 8765) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())