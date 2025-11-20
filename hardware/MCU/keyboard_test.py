"""
Program to test keyboard input for controlls.
Press/hold [SPACE], [UP], [DOWN], [LEFT], [RIGHT] to test.
Press/hold 'Q' or 'q' to quit.
"""

import keyboard
import time

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
        elif keyboard.is_pressed('up'):
            current = "up"
        elif keyboard.is_pressed('down'):
            current = "down"
        elif keyboard.is_pressed('left'):
            current = "left"
        elif keyboard.is_pressed('right'):
            current = "right"
        else:
            current = None

        """
        Print key name once on first press
        Keep printing while held
        Print 0 when nothing pressed
        """

        if current is None:
            print(0)
            last_pressed = None
        else:
            # Newly pressed
            if current != last_pressed:
                print(current)
                last_pressed = current
            else:
                # Held down, keep printing
                print(current)

        # Output rate
        time.sleep(0.1)


if __name__ == "__main__":
    main()
