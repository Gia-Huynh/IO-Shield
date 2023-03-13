import cv2, glob
import numpy as np
import skimage
from skimage import measure
import os
from collections import deque
#filename = "B350M MORTAR.png"
#filename = "B450M Pro4-F(L5).png"
#filename = "GA-H110-D3A.webp"
data_path = "./Data/"
circle_path = "./CircleDetection/"
erosion_path = "./CoolErosion/"

def clearLeftRight (input_image):
	print (input_image.shape)
	FirstDim = input_image.shape[0]
	SecDim = input_image.shape[1]
	top = 0
	for bot in range (0, FirstDim):
		if (np.sum(input_image[bot])/SecDim<0.99):
			break
	top = FirstDim-1
	for top in range (FirstDim-1, 0, -1):
		if (np.sum(input_image[top])/SecDim<0.99):
			break
			
	left = 0
	for left in range (0, SecDim):
		if (np.sum(input_image[:,left])/FirstDim<0.9):
			break
	right = SecDim-1
	for right in range (SecDim-1, 0, -1):
		if (np.sum(input_image[:,right])/FirstDim<0.9):
			break
	#cv2.imshow("KeepLeftRight: ", (input_image[left:right, bot:top]*255).astype(np.uint8))
	#cv2.waitKey(0)
	print (left," : ",right,", ",bot," : ", top)
	return ((input_image[bot:top, left:right]))

def clearMotherboard (input_image):
	FirstDim = input_image.shape[0]
	SecDim = input_image.shape[1]
	
	left = 0
	for left in range (0, FirstDim):
		if (np.sum(input_image[left])/SecDim<1):
			break
		#else:
			#print (np.sum(input_image[left]))
	right = FirstDim-1
	for right in range (FirstDim-1, 0, -1):
		if (np.sum(input_image[right])/SecDim>=0.001):
			break
	return ((input_image[left:right, :]))

def KeepBiggestBlob (input_mask):
    labels_mask = measure.label(input_mask)                       
    regions = measure.regionprops(labels_mask)
    regions.sort(key=lambda x: x.area, reverse=True)
    if len(regions) > 1:
        for rg in regions[1:]:
            labels_mask[rg.coords[:,0], rg.coords[:,1]] = 0
    labels_mask[labels_mask!=0] = 1
    mask = labels_mask
    return mask
    
def CoNhiPhan (a, s):
	a.astype (np.int32)
	
	#Erosion
	gay = cv2.filter2D (a, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay < s*s] = 0
	gay [gay > (s*s-1)] = 1
	gay = cv2.filter2D (a, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay < 1] = 0
	gay [gay > 0] = 1
    
	#invert
	a = 1-gay
	
	#Erosion
	gay = cv2.filter2D (a, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay < s*s] = 0
	gay [gay > (s*s-1)] = 1
	gay = cv2.filter2D (a, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	#gay [gay < 1] = 0
	gay [gay > 0] = 1
    
	a = 1-gay
	"""#Dilation
	gay = cv2.filter2D (a, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	#gay [gay < 1] = 0
	gay [gay > 0] = 1
	gay = cv2.filter2D (a, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay < s*s] = 0
	gay [gay > (s*s-1)] = 1	"""
	gay = a
	return gay.astype (np.uint8)
    
def edgeFilter (a):
	a.astype (np.int32)
	gae = 1
	gay = cv2.filter2D (a, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	
def niggaBFS (image, CoNhiPhanTime = 1	, BlurRatio = 0.0075):#0075
	N = (image.shape)[0]
	M = (image.shape)[1]
	print (M)
	image = cv2.medianBlur(image, int(BlurRatio*M)//2*2+1)
	gay_color = image [0, 0]
	#print (image.shape)
	visited = np.full_like(image[:,:,0], 0)

	#visited = np.where(np.all(image == gay_color,axis=2), 1, 0).astype (np.uint8)
	gayy_color = (gay_color + ((np.array([127,127,127]) - gay_color) * 0.025)).astype (np.uint8)
	if (np.linalg.norm(gay_color) < 10):
		visited = np.where(np.all(image < gayy_color,axis=2), 1, 0).astype (np.uint8)
	else:
		visited = np.where(np.all(image > gayy_color,axis=2), 1, 0).astype (np.uint8)
	visited = KeepBiggestBlob(visited).astype (np.uint8)
	#print (np.where(np.any(image == gay_color)))
	#print (visited.shape)
	x,y,w,h = cv2.boundingRect((1-visited)*255)
	visited = visited[y:y+h, x:x+w]
	visited = clearLeftRight(visited).astype (np.uint8)
	visited = KeepBiggestBlob(visited).astype (np.uint8)
	visited = clearMotherboard(visited).astype (np.uint8)
	visited = clearLeftRight(visited).astype (np.uint8)
	visited = KeepBiggestBlob(visited).astype (np.uint8)
	visited = clearMotherboard(visited).astype (np.uint8)
	#for i in range (0, CoNhiPhanTime):
	#	visited = CoNhiPhan (visited, M//100)
	
	return ((visited)*255)
def contrast (image, ye):
    image = image * ye 
    image = np.clip (image, 0, 255).astype (np.uint8)
    return image
if  __name__ == "__main__":
    contrast_inc = 1.1
    blur_ratio = 5
    for gay_file in glob.glob (data_path+"*.*"):
        file_name = os.path.basename(gay_file).split(".")[-2]
        
        gay_image = cv2.imread (gay_file)
        gay_hsv = cv2.cvtColor(gay_image, cv2.COLOR_BGR2HSV)
        ye = niggaBFS (gay_image)
        #cv2.imshow ('test', gay_image)
        gray = cv2.cvtColor(gay_image, cv2.COLOR_BGR2GRAY)
        gray = contrast (gray, contrast_inc)
        gray = cv2.medianBlur(gray, blur_ratio)
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


        #cv2.imshow("detected circles", gray)
        #cv2.waitKey(0)
        cv2.imwrite (erosion_path + file_name + "_ero.png", ye)
        cv2.imwrite (circle_path + file_name + "_circle.png", gray)