import numpy as np
import cv2 as cv

dictionary = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_6X6_250)
detectorParams = cv.aruco.DetectorParameters()
detector = cv.aruco.ArucoDetector(dictionary, detectorParams)
cap = cv.VideoCapture(0)
if not cap.isOpened():
    print("Cannot open camera")
    exit()
while True:
    ret, frame = cap.read()
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break
    marked = frame.copy()
    marked = cv.flip(marked, 1)
    corners, ids, rejected = detector.detectMarkers(marked)
    cv.aruco.drawDetectedMarkers(marked, corners, ids)
    cv.imshow('frame', marked)
    if cv.waitKey(1) == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv.destroyAllWindows()