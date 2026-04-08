# Main 4 claw directions and stop action
# Talks to the MCU through Serial
import serial
import time
import struct

claw = serial.Serial("COM4", 115200)
# 1, 2, 3, 4 = Up, Down Left, Right
MAIN_VIEW = [4, 3, 2, 1]
SIDE_VIEW = [2, 1, 3, 4]
CLAW_VIEW = [4, 3, 2, 1]
VIEWS = [MAIN_VIEW, SIDE_VIEW, CLAW_VIEW]


def moveClaw(command, view):
    print("Moving claw:", command, "View:", view)
    if command == 0:
        # Stop
        claw.write(b"0\n")
    elif command == 1:
        # Up
        output = str(VIEWS[view][0]) + "\n"
        claw.write(output.encode('utf-8'))
    elif command == 2:
        # Down
        output = str(VIEWS[view][1]) + "\n"
        claw.write(output.encode('utf-8'))
    elif command == 3:
        # Left
        output = str(VIEWS[view][2]) + "\n"
        claw.write(output.encode('utf-8'))
    elif command == 4:
        # Right
        output = str(VIEWS[view][3]) + "\n"
        claw.write(output.encode('utf-8'))
    elif command == 5:
        # Drop claw and stop
        claw.write(b"5\n")
        time.sleep(1)
        claw.write(b"0\n")
    elif command == 7:
        claw.write(b"6\n")
        time.sleep(1)
        claw.write(b"0\n")