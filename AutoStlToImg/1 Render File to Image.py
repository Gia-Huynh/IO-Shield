import glob, os, re
import shutil
import os
from ImgRender import render_stl_screenshot
STL_Folder_Path = "./Maybe Not Posted File"
result_img_path = "./ResultImg"
for file in glob.glob (os.path.join(STL_Folder_Path, "*.stl")):
    gay_name = os.path.basename (file).split (" ___ ")[0]
    t0 = os.path.join(result_img_path, gay_name + "_0.png")
    t1 = os.path.join(result_img_path, gay_name + "_1.png")
    render_stl_screenshot (file, t0, t1)
