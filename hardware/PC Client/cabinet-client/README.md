# PC Client Application

This is the main program that will run on the computer and listen/react to the websocket on the cloud backend.

`main.py` is the main program to run and has the websocket connection. It outputs the data received and the events corresponding to the data (only after the game is active after receiving a "coin")

For the other files:
- `testing_socket.py` - This creates a websocket server to emulate the backend websocket for testing purposes. It sends a uint8 data bit to the PC Client, like the backend.
- `moveClaw.py` - This has the code for the actual claw movement (stop, up, down, left, right, drop) and talks to the MCU via Serial
- `dropClawAndDetect.py` - This has the Computer Vision code to detect a prize and should return if a prize has won or not. It should also call moveClaw only to trigger the claw drop.
- `toggleCamera.py` - This has the code to talk to OBS websocket and cycle through different cameras.

## Number Assignments

The numbers assigned to actions so far:
- `0` - Stop claw movement
- `1` - `4` - Claw directions (up, down, left, right)
- `5` - Claw drop
- `6` - Toggle (cycle) camera views
- `7` - Coin (starts game logic)

## Running this project
1. Have Python 3.12.1 installed as it is what the PC has and install the following packages

    `pip install websockets pyserial`

2. Run `testing_socket.py` first and `main.py` in seperate windows. Type in numbers in the `testing_socket.py` to send data to the Client app


