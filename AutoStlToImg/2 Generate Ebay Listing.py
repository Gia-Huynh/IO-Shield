import glob, os, re
import shutil
import os
from urllib.parse import urljoin
STL_Folder_Path = "./Maybe Not Posted File"
result_img_path = "./ResultImg"
base_hosting_url = "https://file.thietgia.com/SambaPublic/ResultImg/"
Name_Postfix = " I/O Shield, 3D Printed, IO Backplate"
Photo_Url_Postfix = ("|https://file.thietgia.com/SambaPublic/GayPicture1.webp"
                        "|https://file.thietgia.com/SambaPublic/GayPicture2.webp"
                        "|https://file.thietgia.com/SambaPublic/GayPicture3.webp"
                        "|https://file.thietgia.com/SambaPublic/GayPicture4.webp")
with open ("2_listing_img_url.txt", "w") as url_file, open ("2_listing_title.txt", "w") as title_file,  open ("2_brand_names.txt", "w") as brand_file:
    for file in glob.glob (os.path.join(STL_Folder_Path, "*.stl")):
        gay_name = os.path.basename (file).split (" ___ ")[0]
        photo_url_1 = urljoin(base_hosting_url, gay_name + "_0.png").replace (" ", "%20")
        photo_url_2 = urljoin(base_hosting_url, gay_name + "_1.png").replace (" ", "%20")
        url_file.writelines(photo_url_1 + "|" + photo_url_2 + Photo_Url_Postfix + "\n")
        title_file.writelines ((gay_name + Name_Postfix).replace("  ", " ")+"\n")

        brand_name = os.path.basename (file).split (" ")[0]
        brand_file.writelines (brand_name+"\n")
