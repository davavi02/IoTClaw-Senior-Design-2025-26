# Main 4 claw directions and stop action
# Talks to the MCU through Serial
import serial
import time

claw = serial.Serial("COM4", 115200)

async def moveClaw(command):
    print("Moving claw: ", command)
    if command == 0:
        # Stop
        claw.write(b"0\n")
    elif command == 1:
        # Up
        claw.write(b"1\n")
    elif command == 2:
        # Down
        claw.write(b"2\n")
    elif command == 3:
        # Left
        claw.write(b"3\n")
    elif command == 4:
        # Right
        claw.write(b"4\n")
    elif command == 5:
        # Drop claw and stop
        claw.write(b"4\n")
        time.sleep(1)
        claw.write(b"0\n")
    elif command == 7:
        claw.write(b"6\n")
        time.sleep(1)
        claw.write(b"0\n")