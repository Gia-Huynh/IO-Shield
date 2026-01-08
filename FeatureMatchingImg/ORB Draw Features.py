import numpy as np
import cv2 as cv, cv2
from matplotlib import pyplot as plt

def getConnectedWithStat (inp_img):
    num_labels, labels, stats, centroids = cv.connectedComponentsWithStats(
        inp_img, connectivity = 4
    )
    # FORMAT: 
    #centroids[i]: (x, y)
    #labels.shape = (312, 1102)
    #stats.shape = (number of labels, 5)
    #stats[i]: [CC_STAT_LEFT, CC_STAT_TOP, CC_STAT_WIDTH, CC_STAT_HEIGHT, CC_STAT_AREA]
    #centroids.shape = (number of labels, 2) (Probably x and y)
    
    components = []
    for i in range(1, num_labels):
        x, y, w, h, area = stats[i]
        if area < 50:   # noise filter
            continue
        mask = (labels == i).astype(np.uint8) * 255
        components.append({
            "label": i,
            "bbox": (x, y, w, h),
            "area": area,
            "mask": mask,
            "centroid": centroids[i]
        })
    areas = [c["area"] for c in components]
    components_sorted = sorted(components, key = lambda c: c["area"], reverse=True)
    areas_sorted = sorted(areas, reverse=True)
    return components_sorted, areas_sorted

def cleaningConnectedCompoents(inp_img):    
    components_sorted, areas_sorted = getConnectedWithStat (inp_img.astype (np.uint8))    
    top_cap = 9000
    bot_cap = 200
    circle_cap = 1000
    delete_mask = np.zeros(components_sorted[0]["mask"].shape)
    keep_mask = np.zeros(components_sorted[0]["mask"].shape)
    for i in range (0, len(components_sorted)):
        temp_width = components_sorted[i]["bbox"][2]
        temp_height = components_sorted[i]["bbox"][3]
        if ((areas_sorted[i] > top_cap) or #If region too big
            (areas_sorted[i] < bot_cap) or #If region too small
            (areas_sorted[i] < circle_cap and ((temp_height/temp_width > 1.4) or (temp_width/temp_height>1.4) or (temp_height*temp_width/components_sorted[i]["area"]>1.25))) or #If region is kinda small but not a circle shape, or has huge hole in middle or weird shape
            (temp_height/temp_width > 2.25) or #If region too "tall"
            (temp_width/temp_height > 4.5) #If region too "wide", tested DVI cua B350m mortar thi ratio la 3.75
            or (temp_height*temp_width/components_sorted[i]["area"]>1.5)  #If region shape is too weird (bounding box is twice as large as area)
            ):
            delete_mask = delete_mask + components_sorted[i]["mask"]
        else:
            keep_mask = keep_mask + components_sorted[i]["mask"]            
    kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, (7, 7))[2:-2] #ElLIPSE DOES NOT LIKE EVEN NUMBER
    keep_mask_closed = cv.morphologyEx(keep_mask, cv.MORPH_CLOSE, kernel, iterations=1)
    return keep_mask_closed

port_id_dict = {"ethernet":     1, 1:"ethernet",
                "usb":  2, 2:"usb",
                "audio":3, 3:"audio",
                "2usb": 4, 4:"2usb",
                "ps2-wifi":     6, 6:"ps2-wifi",
                "displayport":  5, 5:"displayport",
                "dvi":7, 7:"dvi",
                "com":8, 8:"com",
                }
def port_detect_heuristic (SingleConnectedComponent):
    x, y, w, h = SingleConnectedComponent["bbox"]
    area = SingleConnectedComponent["area"]
    full_mask = np.copy(SingleConnectedComponent["mask"])
    mask = np.copy(full_mask)[y:y+h, x:x+w]
    centroid = SingleConnectedComponent["centroid"]
    if (95>w) and (w > 58) and     (95 > h) and    (h > 55):
        if ((np.sum(mask[0:12]!=0) / (12*w)) < 0.5) or ((np.sum(mask[0:30]!=0) / (30*w)) < 0.75):
            return port_id_dict ["ethernet"]
        else:
            print ("Ethernet candidate rejected: ", w, h)
    if (w > 320) and (80 > h):
        return port_id_dict["com"]
    if (w > 150) and (80 > h):
        return port_id_dict["dvi"]
    if (95 > w) and     (w  > 50) and   (45 > h) and (h > 15):
        return port_id_dict ["usb"]
    elif (140 > w) and  (w  >= 100) and   (58 > h) and (h > 15):
        return port_id_dict ["displayport"]
    
    if (w/h > 0.66) and (h/w > 0.66):  #If circular
        if (45 > w) and (45 > h): #And small size
            return port_id_dict ["audio"]
        if (80 > w) and (80 > h): #But if big size, maybe adding circle check? But does the heuristic need to be *that* precise?
            return port_id_dict ["ps2-wifi"]
        
    if (95 > w)  and   (w  > 50)  and   (120 > h) and (h > 80):
        return port_id_dict ["2usb"] #ps2 de bi lon thanh 2usb
def textOverlayOnImage (img, text_string, x, y):
    font                   = cv2.FONT_HERSHEY_SIMPLEX
    bottomLeftCornerOfText = (x, y)
    fontScale              = 1
    fontColor              = (125)
    thickness              = 1
    lineType               = 2
    img = cv2.putText(  img,
                        text_string, 
                        bottomLeftCornerOfText, 
                        font, 
                        fontScale,
                        fontColor,
                        thickness,
                        lineType)
    return img

def show_Canny (img_path):
    img = cv.imread(img_path, cv.IMREAD_GRAYSCALE) #CLAHE Applicable
    img = cv2.resize (img, (1100, 310))
    edges = cv.Canny(cv.blur(img, (11, 11)), 40, 120)
    
    kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, (7, 7)) #(cv.MORPH_RECT, (5, 5))
    closed = cv.morphologyEx(edges, cv.MORPH_CLOSE, kernel, iterations=2) #THINNING_ZHANGSUEN possible
    closed_invert = np.max(closed) - closed
    kernel = cv.getStructuringElement(cv.MORPH_RECT, (7, 7))
    closed_invert = cv.morphologyEx(closed_invert, cv.MORPH_OPEN, kernel, iterations=1)
    closed_invert = cv2.copyMakeBorder(closed_invert,1,1,1,1,cv2.BORDER_CONSTANT,value=255)


    old_components_sorted, old_areas_sorted = None, None
    display_img_list = []
    keep_mask_closed = np.copy(closed_invert)
    while True:
        keep_mask_closed = cleaningConnectedCompoents (keep_mask_closed.astype (np.uint8))
        components_sorted, areas_sorted = getConnectedWithStat (keep_mask_closed.astype (np.uint8))
        if (old_areas_sorted is None) or (areas_sorted != old_areas_sorted):
            old_areas_sorted = areas_sorted
            display_img_list.append (keep_mask_closed)
        else:
            break
    del old_components_sorted, old_areas_sorted

    list_port_position = []
    text_overlayed_img = np.copy(keep_mask_closed)
    for component in components_sorted:
        port_id = port_detect_heuristic (component)
        if (port_id is None):
            continue
        text_overlayed_img = textOverlayOnImage (text_overlayed_img, port_id_dict[port_id], component["bbox"][0], component["bbox"][1])
        list_port_position.append ({"port_id": port_id, "centroid": component["centroid"]})
  
    img = np.vstack((img, edges, closed, closed_invert[1:-1, 1:-1])) #, closed_thinned
    cv2.imshow(img_path, img)
    display_img_list.append (text_overlayed_img)  
    mask_process_img = np.vstack(display_img_list) #delete_mask, keep_mask, 
    cv2.imshow ("inp, deleted, keep, keep_mask_closed", mask_process_img)
    return list_port_position, text_overlayed_img, keep_mask_closed

import os
folder = r"./Manufacturer IO/"
for fname in sorted(os.listdir(folder)):
    img_path = os.path.join(folder, fname)
    print(f"Showing: {fname}")
    show_Canny(img_path)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    

cv2.waitKey(0)
cv2.destroyAllWindows()
