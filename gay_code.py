import cv2	
import numpy as np
from collections import deque
#filename = "B450M Pro4-F(L5).png"
filename = "GA-H110-D3A.webp"

def niggaBFS (image):
	image = cv2.medianBlur(image, 3)
	gay_color = image [0, 0]
	print (image.shape)
	N = (image.shape)[0]
	M = image.shape[1]
	visited = np.full_like(image[:,:,0], 0)
	
	visited = np.where(np.all(image == gay_color,axis=2), 1, 0).astype (np.uint8)
	print (np.where(np.any(image == gay_color)))
	print (visited.shape)
	cv2.imshow("BFS", visited*255)
	return visited
	
gay_image = cv2.imread (filename)
gay_hsv = cv2.cvtColor(gay_image, cv2.COLOR_BGR2HSV)
niggaBFS (gay_image)

cv2.imshow ('test', gay_image)
gray = cv2.cvtColor(gay_image, cv2.COLOR_BGR2GRAY)
print (gray.dtype)
gray [gray < 36] = 0
gray [gray > 35] -= 35
gray = gray * 1.2
gray = np.clip (gray, 0, 255).astype (np.uint8)
gray = cv2.medianBlur(gray, 9)
rows = gray.shape[0]
circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1, rows/8,
                               param1=80, param2=20,
                               minRadius=int(rows/10), maxRadius=int(rows/8))
if circles is not None:	
    circles = np.uint16(np.around(circles))
    for i in circles[0, :]:
        center = (i[0], i[1])
        # circle center
        cv2.circle(gray, center, 1, (0, 100, 100), 3)
        # circle outline
        radius = i[2]
        cv2.circle(gray, center, radius, (255, 0, 255), 3)


cv2.imshow("detected circles", gray)
cv2.waitKey(0)