# copy_new_stl.py
import os
from pathlib import Path
from datetime import datetime
import shutil, re
import glob

timestamp_file = "0 timestamps.txt"
source_dir = Path("C:/Users/Za/Desktop/3D Printing/Shopee/IO Shield/") # root folder to search

FatherPath = "C:/Users/Za/Desktop/3D Printing/Shopee/IO Shield/"
FolderList = ['Asrock', 'Asus', 'Dell', 'EVGA', 'Gigabyte',
                'HP', 'Huananzhi', 'Intel', 'Msi',
                'ZZZ_QAT', 'ZZZ_QAT/Abit', 'ZZZ_QAT/Acer', 'ZZZ_QAT/BCM', 'ZZZ_QAT/Biostar',
                'ZZZ_QAT/Colorful', 'ZZZ_QAT/Daewoo', 'ZZZ_QAT/Datto', 'ZZZ_QAT/ECS',
                'ZZZ_QAT/Galax', 'ZZZ_QAT/Kllisre', 'ZZZ_QAT/Machinist', 'ZZZ_QAT/Maxsun',
                'ZZZ_QAT/OEM', 'ZZZ_QAT/SuperMicro', 'ZZZ_QAT/Winnfox', 'ZZZ_QAT/Zotac']

destination_dir = Path("L:/IO-Shield/AutoStlToImg/Maybe Not Posted File/")
destination_dir.mkdir(parents=True, exist_ok=True)

# Load the newest timestamp
with open(timestamp_file) as f:
    lines = f.read().splitlines()
    if not lines:
        raise ValueError("No timestamp found!")
    newest_ts = datetime.fromisoformat(lines[-1])

# Recursively find .stl files newer than timestamp
def generate_motherboard_listingName (filePath):
    t = os.path.basename(filePath)
    t = re.sub(FolderName.split('/')[-1], '', t, flags=re.IGNORECASE) #
    if (t[0] == ' '):
        t = t[1:]
    t = re.sub(r'\[.*?\]', '', t)
    t = re.sub(r'\(.*?\)', '', t)
    t = t.replace (" .", ".")
    #t = t.replace (".stl", "")
    t = re.sub(".stl", '', t, flags=re.IGNORECASE)
    if FolderName!='ZZZ_QAT':
        t = FolderName.split('/')[-1] + " " + t
    return t 
for FolderName in FolderList:
    for filePath in [os.path.normpath(i) for i in glob.glob (os.path.join(FatherPath, FolderName, "*.stl"))]:
        listingName = generate_motherboard_listingName (filePath)
        new_name = listingName + " ___ " + os.path.basename(filePath)
        
        file_mtime = os.path.getmtime(filePath)
        print (file_mtime)
        print (newest_ts)
        if file_mtime > newest_ts.timestamp():
            dest_path = destination_dir / new_name
            shutil.copy2(filePath, dest_path)
            print(f"Copied: {filePath} -> {dest_path}")
