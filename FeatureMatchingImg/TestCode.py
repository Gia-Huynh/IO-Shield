import numpy as np
import cv2 as cv
import matplotlib.pyplot as plt
 
img1 = cv.imread('USB.png',cv.IMREAD_GRAYSCALE)          # queryImage
img2 = cv.imread('TestImg.png',cv.IMREAD_GRAYSCALE) # trainImage
# Initiate SIFT detector
sift = cv.SIFT_create()
 
# find the keypoints and descriptors with SIFT
kp1, des1 = sift.detectAndCompute(img1,None)
kp2, des2 = sift.detectAndCompute(img2,None)
 
# FLANN parameters
FLANN_INDEX_KDTREE = 1 #Leave it a lone bruh
index_params = dict(algorithm = FLANN_INDEX_KDTREE, trees = 6) # Number of parallel KD-trees
search_params = dict(checks=90)  # Number of leaf nodes visited # or pass empty dictionary
 
flann = cv.FlannBasedMatcher(index_params,search_params)
 
matches = flann.knnMatch(des1,des2,k=2) #Find the k = 2 nearest descriptors in des2
 
# Need to draw only good matches, so create a mask
matchesMask = [[0,0] for i in range(len(matches))]
 
# ratio test as per Lowe's paper
for i,(m,n) in enumerate(matches):
    if m.distance < 0.7*n.distance:
        matchesMask[i]=[1,0]
 
draw_params = dict(matchColor = (0,255,0),
                   singlePointColor = (255,0,0),
                   matchesMask = matchesMask,
                   flags = cv.DrawMatchesFlags_DEFAULT)
 
img3 = cv.drawMatchesKnn(img1,kp1,
                         img2,kp2,
                         matches,
                         None,
                         **draw_params)
 
plt.imshow(img3,),plt.show()
