# The drop move is seperate from the moveClaw as its an "endgame" move
# After the claw is dropped, a check is done to see if a prize was won or not
import cv2 as cv
import numpy as np
import time
from moveClaw import moveClaw

async def dropClawAndDetect():
    print("Dropping and Detecting")
    await moveClaw(5)
    time.sleep(6)
    dictionary = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_6X6_250)
    detectorParams = cv.aruco.DetectorParameters()
    detector = cv.aruco.ArucoDetector(dictionary, detectorParams)
    cap = cv.VideoCapture(1)
    if not cap.isOpened():
        print("Cannot open camera")
        exit()
    # Amount of tries to check if a prize is won
    tries = 3
    found = 0
    while tries > 0:
        ret, frame = cap.read()
        if not ret:
            print("Can't receive frame (stream end?). Exiting ...")
            break
        marked = frame.copy()
        marked = cv.flip(marked, 1)
        corners, ids, rejected = detector.detectMarkers(marked)
        cv.aruco.drawDetectedMarkers(marked, corners, ids)
        # cv.imshow('frame', marked)
        # Save images to files, imshow too slow to load in a window
        cv.imwrite("test{0}.png".format(tries), marked)
        time.sleep(1)
        try:
            if (np.size(ids, axis=0) == 5):
                found += 1
        except:
            pass
        tries -= 1
    cap.release()
    # Amount of successful checks to determine if won
    if found == 3:
        return 1
    else:
        return 0
    #cv.destroyAllWindows()