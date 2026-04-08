# The drop move is seperate from the moveClaw as its an "endgame" move
# After the claw is dropped, a check is done to see if a prize was won or not
import cv2 as cv
import numpy as np
import time
from moveClaw import moveClaw

def dropClawAndDetect(messages):
    print("Dropping and Detecting")
    moveClaw(5, 0)
    time.sleep(6)
    try:
        dictionary = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_6X6_250)
        detectorParams = cv.aruco.DetectorParameters()
        detector = cv.aruco.ArucoDetector(dictionary, detectorParams)
        cap = cv.VideoCapture(2)
        if not cap.isOpened():
            raise ValueError("Cannot open camera")
        # Amount of tries to check if a prize is won
        tries = 3
        found = 0
        while tries > 0:
            ret, frame = cap.read()
            if not ret:
                raise ValueError("Cannot get camera frame")
            marked = frame.copy()
            marked = cv.flip(marked, 1)
            corners, ids, rejected = detector.detectMarkers(marked)
            cv.aruco.drawDetectedMarkers(marked, corners, ids)
            # Save images to files, imshow too slow to load in a window
            cv.imwrite("test{0}.png".format(tries), marked)
            time.sleep(1)
            try:
                if not (np.size(ids, axis=0) == 5):
                    found += 1
            except:
                pass
            tries -= 1
        cap.release()
    except Exception as e:
        time.sleep(3)
        print(e)
        messages.put(1)
    else:
        if found == 3:
            print("Prize won")
            messages.put(0)
        else:
            print("No prize")
            messages.put(1)