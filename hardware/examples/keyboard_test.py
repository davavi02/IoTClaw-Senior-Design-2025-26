"""
Program to test keyboard input for controlls.
Press/hold [SPACE], [UP], [DOWN], [LEFT], [RIGHT] to test.
Press/hold 'Q' or 'q' to quit.
"""
import serial
import keyboard
import time

gantry = serial.Serial('COM4', 115200)

def main():
    print("Press arrow keys or SPACE. Type Q to quit.\n")
    
    # Track whether a key was printed already
    last_pressed = None

    while True:
        # Exit if q or Q is held
        if keyboard.is_pressed('q') or keyboard.is_pressed('Q'):
            print("Exiting...")
            break

        # Check each key
        if keyboard.is_pressed('space'):
            current = "space"
            serout = 1
        elif keyboard.is_pressed('up'):
            current = "up"
            serout = 5
        elif keyboard.is_pressed('down'):
            current = "down"
            serout = 4
        elif keyboard.is_pressed('left'):
            current = "left"
            serout = 2
        elif keyboard.is_pressed('right'):
            current = "right"
            serout = 3
        elif keyboard.is_pressed('c'):
            current = "coin"
            serout = 6
        else:
            current = None

        """
        Print key name once on first press
        Keep printing while held
        Print 0 when nothing pressed
        """

        if current is None:
            print(0)
            gantry.write(b'0\n')
            last_pressed = None
        else:
            # Newly pressed
            if current != last_pressed:
                print(current)
                gantry.write(bytes(str(serout) + '\n', encoding="utf-8"))
                last_pressed = current
            else:
                # Held down, keep printing
                print(current)
                gantry.write(bytes(str(serout) + '\n', encoding="utf-8"))

        # Output rate
        time.sleep(0.1)


if __name__ == "__main__":
    main()
