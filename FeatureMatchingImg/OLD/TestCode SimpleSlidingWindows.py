import numpy as np
import cv2 as cv, cv2
import glob
from matplotlib import pyplot as plt
 
def chamfer_match (img_path, template_dir="port_img_templates"):
    img = cv.imread(img_path, cv.IMREAD_GRAYSCALE)
    clahe = cv.createCLAHE(clipLimit=2.0, tileGridSize=(12,12))
    img = clahe.apply(img)
    edges_img = cv.Canny(cv.blur(img, (11,11)), 40, 140)
    dist = cv.distanceTransform(
        cv.bitwise_not(edges_img),
        distanceType = cv.DIST_L2, #cv.DIST_L2
        maskSize = 3
    )
    dist = dist - np.min(dist)
    dist = dist/np.max(dist)
    
    template_paths = sorted(glob.glob(os.path.join(template_dir, "USB*.png")))
    for template_path in template_paths:
        port = cv.imread(template_path, cv.IMREAD_GRAYSCALE)

        #port = cv.imread("port_img_templates/USB5.png", cv.IMREAD_GRAYSCALE)
        edges_port = cv.Canny(cv.blur(port, (5,5)), 40, 100)
        #dist_port = edges_port
        dist_port = cv.distanceTransform(
            #edges_port,
            cv.bitwise_not(edges_port),
            cv.DIST_L2,
            3
        )
        dist_port = dist_port - np.min(dist_port)
        dist_port = dist_port/np.max(dist_port)
        
        score = cv.filter2D(dist, -1, dist_port)
        score_OG = np.max(score) - score
        score_OG = score_OG - np.min(score_OG)
        score_OG = (score_OG/np.max(score_OG) * 255).astype(np.uint8)
        score_OG[score_OG <= 252] = 0 
        
        score = score - np.min(score)
        score = (score/np.max(score) * 255).astype(np.uint8)
        #img = (img// 2 + score// 2)
        showed_img = np.vstack((img, edges_img, (dist/np.max(dist)*255).astype(np.uint8),score_OG, score))
        #cv2.imshow ("port " + template_path, ((dist_port-np.min(dist_port))/np.max(dist_port)*255).astype(np.uint8))
        cv2.imshow ("port " + template_path, np.copy(score_OG))
    cv2.imshow (img_path, showed_img)


def chamfer_match_backup(img_path, template_dir="port_img_templates"):
    img = cv.imread(img_path, cv.IMREAD_GRAYSCALE)
    clahe = cv.createCLAHE(clipLimit=2.0, tileGridSize=(12,12))
    img = clahe.apply(img)

    edges_img = cv.Canny(cv.blur(img, (7, 7)), 40, 150)

    dist = cv.distanceTransform(
        cv.bitwise_not(edges_img),
        cv.DIST_L2,
        3
    )

    results = []

    template_paths = sorted(glob.glob(os.path.join(template_dir, "USB*.png")))

    for tpl_path in template_paths:
        port = cv.imread(tpl_path, cv.IMREAD_GRAYSCALE)
        edges_port = cv.Canny(cv.blur(port, (5,5)), 40, 150)

        score = cv.filter2D(dist, cv.CV_32F, edges_port)

        # Normalize for stability (not for comparison!)
        score_norm = score - score.min()
        score_norm /= score_norm.max()

        min_val, _, min_loc, _ = cv.minMaxLoc(score_norm)

        h, w = edges_port.shape
        x, y = min_loc

        # Create result mask
        mask = np.copy(score_norm)
        #mask[0:h, 0:w] = edges_port

        results.append({
            "template": os.path.basename(tpl_path),
            "score": min_val,
            "location": (x, y),
            "mask": mask,
            "bbox": (x, y, w, h)
        })
    result_summed = np.zeros (results[0]["mask"].shape, dtype = np.int32)
    for i in results:
        result_summed = result_summed + i["mask"]
    result_summed = np.max(result_summed) - result_summed
    result_summed = (result_summed / np.max(result_summed) * 255).astype (np.uint8)
    #result_summed = (result_summed//len(results))#.astype (np.uint8)
    #print (np.max(result_summed))
    return img, edges_img, results, result_summed

import os
folder = r"./Manufacturer IO/"
for fname in sorted(os.listdir(folder)):
    #if not fname.lower().endswith(valid_exts):
    #    continue
    img_path = os.path.join(folder, fname)
    print(f"Showing: {fname}")
    chamfer_match(img_path)

    """img, edges_img, results, result_summed = chamfer_match(img_path)
    cv2.imshow ("img",  img)
    cv2.imshow ("edges_img",  edges_img)
    cv2.imshow ("results[0]",  results[3]["mask"])
    cv2.imshow ("result_summed",  result_summed)"""
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    

cv2.waitKey(0)
cv2.destroyAllWindows()
