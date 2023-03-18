import cv2, glob
import numpy as np
import skimage
from skimage import measure
import matplotlib.pyplot as plt #'3.0.3'
import os

def clearLeftRight (input_image, tolerance = 0.95):
        FirstDim = input_image.shape[0]
        SecDim = input_image.shape[1]
        yes = np.sum(input_image, axis = 1)/SecDim
        bot = np.argmax (yes < tolerance)
        top = FirstDim - np.argmax (yes[::-1] < tolerance)
                
        yes = np.sum(input_image, axis = 0)/FirstDim
        left = np.argmax (yes < tolerance)
        right = SecDim - np.argmax (yes[::-1] < tolerance)

        return ((input_image[bot:top+1, left:right+1]))

def clearMotherboard (input_image):
		FirstDim = input_image.shape[0]
		SecDim = input_image.shape[1]
		gay = np.sum(input_image, axis = 1)/SecDim

		bot = np.argmax (gay<1)
		top = FirstDim
		#top = FirstDim - np.argmax (gay[::-1] >=0.001)
		return ((input_image[bot:top, :]))

#Taken from stackoverflow
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
    
def CoNhiPhan (gay, s):
	gay.astype (np.int32)
	#Erosion
	gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay < s*s] = 0
	gay [gay > (s*s-1)] = 1
	gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay > 0] = 1
    	
	#Erosion of invert
	gay = cv2.filter2D (1-gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay < s*s] = 0
	gay [gay > (s*s-1)] = 1
	gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay > 0] = 1
    
	#Dilation of invert, again
	gay = cv2.filter2D (1-gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay > 0] = 1
	gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay < s*s] = 0
	gay [gay > (s*s-1)] = 1
	return gay.astype (np.uint8)
    
def niggaBFS (image, CoNhiPhanTime = 1	, BlurRatio = 0.0075, file_name = "gay"):

        #simple blur
	image = cv2.medianBlur(image, int(BlurRatio*(image.shape)[1])//2*2+1)
	
	#Get background color, top left most of image
	gay_color = image [0, 0]
	gayy_color = (gay_color + ((np.array([127,127,127]) - gay_color) * 0.025)).astype (np.uint8)

	#Mask for background color (which is the IO shield)
	visited = np.full_like(image[:,:,0], 0)
	if (np.linalg.norm(gay_color) < 10):
		visited = np.where(np.all(image < gayy_color,axis=2), 1, 0).astype (np.uint8)
	else:
		visited = np.where(np.all(image > gayy_color,axis=2), 1, 0).astype (np.uint8)
		
	visited = KeepBiggestBlob(visited).astype (np.uint8)
	
	plt.imsave("DebugData/" + file_name + "KeepBiggest.png",visited*255,cmap='gray')
	x,y,w,h = cv2.boundingRect((1-visited)*255)
	visited = visited[y:y+h, x:x+w]
	plt.imsave("DebugData/" + file_name + "boundingRect.png",visited*255,cmap='gray')
	
	visited = clearLeftRight(visited).astype (np.uint8)
	plt.imsave("DebugData/" + file_name + "clearLeftRight.png",visited*255,cmap='gray')
	visited = KeepBiggestBlob(visited).astype (np.uint8)
	visited = clearMotherboard(visited).astype (np.uint8)
	plt.imsave("DebugData/" + file_name + "clearMotherboard.png",visited*255,cmap='gray')
	visited = clearLeftRight(visited).astype (np.uint8)
	visited = KeepBiggestBlob(visited).astype (np.uint8)
	
	plt.imsave("DebugData/" + file_name + "BeforeErosion.png",visited*255,cmap='gray')
	for i in range (0, CoNhiPhanTime):
		visited = CoNhiPhan (visited, (visited.shape[1])//100)
	plt.imsave("DebugData/" + file_name + "Final.png",visited*255,cmap='gray')
	return ((visited)*255)

def contrast (image, ye):
    image = image * ye 
    image = np.clip (image, 0, 255).astype (np.uint8)
    return image

def brightness (image, ye):
    image = image + ye 
    image = np.clip (image, 0, 255).astype (np.uint8)
    return image

def PaddingCleaning (ye, right_padding, bottom_padding, left_padding, fileName):
	top_padding = int((ye.shape [1] + right_padding + left_padding) * 390 / 1524 - (ye.shape[0]+bottom_padding) + 0.5)
	if top_padding < 0:
			print ("Uh oh, why is top padding negative? ",fileName)
			top_padding = 1
	ye = cv2.copyMakeBorder (ye, top_padding,bottom_padding,left_padding,right_padding,cv2.BORDER_CONSTANT,value=255)
	ye = cv2.resize (src = ye, dsize = (1524,int(1524/ye.shape[1] * ye.shape[0])), interpolation = cv2.INTER_NEAREST)
	#Uncomment to remove small detail.
	#Resize to small image, then upsize back to original size, will slightly remove accuracy.
	ye = cv2.resize (src = ye, dsize = (381,int(381/ye.shape[1] * ye.shape[0])), interpolation = cv2.INTER_NEAREST)
	ye = cv2.resize (src = ye, dsize = (1524,int(1524/ye.shape[1] * ye.shape[0])), interpolation = cv2.INTER_NEAREST)
	ye = cv2.copyMakeBorder (ye, 1,1,1,1,cv2.BORDER_CONSTANT,value=0)
	return ye
