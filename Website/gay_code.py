import cv2
import numpy as np
import skimage
from skimage import measure

#import matplotlib.pyplot as plt
def readImg (path):
	return (cv2.imread (path))

#clear left and right of the picture
def clearLeftRight (input_image, tolerance = 0.98):
        FirstDim = input_image.shape[0]
        SecDim = input_image.shape[1]
        yes = np.sum(input_image, axis = 1)/SecDim
        bot = np.argmax (yes < tolerance)
        top = FirstDim - np.argmax (yes[::-1] < tolerance)
                
        yes = np.sum(input_image, axis = 0)/FirstDim
        left = np.argmax (yes < tolerance)
        right = SecDim - np.argmax (yes[::-1] < tolerance)

        return ((input_image[bot:top+1, left:right+1]))

#clear the motherboard from image
def clearMotherboard (input_image):
		FirstDim = input_image.shape[0]
		SecDim = input_image.shape[1]
		gay = np.sum(input_image, axis = 1)/SecDim
		#print (input_image.shape)
		bot = np.argmax ((0 < gay) & (gay < 1))
		top = FirstDim
		#print (np.argmax ((0 < gay) & (gay < 1)))
		#print ((input_image[bot:top, :]).shape)
		#plt.plot (gay)
		#plt.show()
		top = FirstDim - np.argmax (gay[::-1] >=0.001)
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
	#Invert
	#np.unique (gay) => [0 1]
	gay = 1-gay
	gay= gay.astype (np.int16)
	#Erosion 
	gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay < s*s] = 0
	gay [gay > (s*s-1)] = 1
	gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay > 0] = 1
	
	#Dilation
	gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay > 0] = 1
	gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	gay [gay < s*s] = 0
	gay [gay > (s*s-1)] = 1
	
	#Dilation
	#gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	#gay [gay > 0] = 1
	#gay = cv2.filter2D (gay, ddepth = -1, kernel = (np.ones ((s, s)).astype(np.int32)))
	#gay [gay < s*s] = 0
	#gay [gay > (s*s-1)] = 1
    	
		
	#gay = 1-gay
	gay = 1-gay
	return gay.astype (np.uint8)
	
    
def niggaBFS (image, CoNhiPhanTime = 0	, BlurRatio = 0.0075, file_name = "debug", debug_mode = 0):

	if (debug_mode == 1):
			from matplotlib.pyplot import imsave
        #simple blur
	image = cv2.medianBlur(image, int(BlurRatio*(image.shape)[1])//2*2+1)
	
	#Get background color, top left most of image
	gay_color = image [0, 0]
	gayy_color = (gay_color + ((np.array([127,127,127]) - gay_color) * 0.005)).astype (np.uint8)

	#Mask for background color (which is the IO shield)
	visited = np.full_like(image[:,:,0], 0)
	if (np.linalg.norm(gay_color) < 10):
		visited = np.where(np.all(image < gayy_color,axis=2), 1, 0).astype (np.uint8)
	else:
		visited = np.where(np.all(image > gayy_color,axis=2), 1, 0).astype (np.uint8)
		
	visited = KeepBiggestBlob(visited).astype (np.uint8)
	
	image[visited == 0] = 0
	if (debug_mode == 1):
		imsave("Data/DebugData/1_" + file_name + "_debug.png",image)
	x,y,w,h = cv2.boundingRect((1-visited)*255)
	visited = visited[y:y+h, x:x+w]
	if (debug_mode == 1):
		imsave("Data/DebugData/2_" + file_name + "_boundingRect.png",visited*255,cmap='gray')
	
	visited = clearLeftRight(visited).astype (np.uint8)
	if (debug_mode == 1):
		imsave("Data/DebugData/3_" + file_name + "_clearLeftRight.png",visited*255,cmap='gray')
	#visited = KeepBiggestBlob(visited).astype (np.uint8)
	visited = clearMotherboard(visited).astype (np.uint8)
	if (debug_mode == 1):
		imsave("Data/DebugData/4_" + file_name + "_clearMotherboard.png",visited*255,cmap='gray')
	visited = clearLeftRight(visited).astype (np.uint8)
	#visited = KeepBiggestBlob(visited).astype (np.uint8)
	
	if (debug_mode == 1):
		imsave("Data/DebugData/5_" + file_name + "_BeforeErosion.png",visited*255,cmap='gray')
	CoNhiPhanArr = [0, 20, 35, 45, 55, 60, 63, 65]
	for i in range (0, CoNhiPhanTime):
		#print (CoNhiPhanArr[min(i, len(CoNhiPhanArr)-1)])
		visited = CoNhiPhan (visited, (visited.shape[1])//(75-CoNhiPhanArr[min(i, len(CoNhiPhanArr)-1)]))
	if (debug_mode == 1):
		imsave("Data/DebugData/6_" + file_name + "_Final.png",visited*255,cmap='gray')
	visited = clearMotherboard(visited).astype (np.uint8)
	return ((visited)*255)

def contrast (image, ye):
    image = image * ye 
    image = np.clip (image, 0, 255).astype (np.uint8)
    return image

def brightness (image, ye):
    image = image + ye 
    image = np.clip (image, 0, 255).astype (np.uint8)
    return image

def PaddingCleaning (ye, right_padding, bottom_padding, left_padding, top_padding, fileName, debug_mode = 0):
	#top_padding = int((ye.shape [1] + right_padding + left_padding) * 390 / 1393 - (ye.shape[0]+bottom_padding) + 0.5)
	#if top_padding < 0:
	#		print ("Uh oh, why is top padding negative? It is not supposed to be so, ",fileName)
			#top_padding = 1
	#		ye = cv2.copyMakeBorder (ye[(-1*top_padding):ye.shape[0],:], 1,bottom_padding,left_padding,right_padding,cv2.BORDER_CONSTANT,value=255)
	#else:
	#		ye = cv2.copyMakeBorder (ye, top_padding,bottom_padding,left_padding,right_padding,cv2.BORDER_CONSTANT,value=255)
	ye = cv2.copyMakeBorder (ye, top_padding, bottom_padding, left_padding, right_padding, cv2.BORDER_CONSTANT, value=255)
	ye = cv2.resize (src = ye, dsize = (1393,390), interpolation = cv2.INTER_NEAREST)
	#Uncomment to remove small detail.
	#Resize to small image, then upsize back to original size, will slightly remove accuracy.
	#ye = cv2.resize (src = ye, dsize = (381,int(381/ye.shape[1] * ye.shape[0])), interpolation = cv2.INTER_NEAREST)
	ye = cv2.resize (src = ye, dsize = (1393,int(1393/ye.shape[1] * ye.shape[0])), interpolation = cv2.INTER_NEAREST)
	ye = cv2.copyMakeBorder (ye, 1,1,1,1,cv2.BORDER_CONSTANT,value=0)
	return ye
