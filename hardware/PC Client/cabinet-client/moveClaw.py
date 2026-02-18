# Main 4 claw directions and stop action
# Talks to the MCU through Serial
import serial

async def moveClaw(command):
    print("Moving claw: ", command)