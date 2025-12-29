import glob, os, re
from thefuzz import process
from thefuzz import fuzz
import shutil
import os

EbayFileWordList = ["IO", " io", "I/O", "I/o", "i/o", "Shield",
                    "[Got From Printable]", "Backplate", 
                    "shield", "3D", "3d", "Printed", "printed",
                    "Print", "Plate", "plate",
                    "Black", "White", "WHITE", "BLACK",
                    "Random", " Plat", " color", " Color", " or ",
                    "[", "]", "/", ",", "\n", "  "]
EbayFileIdx = "./0_Uploaded IO Ebay.txt"
EbayFileLineList =  []

FatherPath = "C:/Users/Za/Desktop/3D Printing/Shopee/IO Shield/"
FolderList = ['Asrock', 'Asus', 'Dell', 'EVGA', 'Gigabyte',
                'HP', 'Huananzhi', 'Intel', 'Msi',
                'ZZZ_QAT', 'ZZZ_QAT/Abit', 'ZZZ_QAT/Acer', 'ZZZ_QAT/BCM', 'ZZZ_QAT/Biostar',
                'ZZZ_QAT/Colorful', 'ZZZ_QAT/Daewoo', 'ZZZ_QAT/Datto', 'ZZZ_QAT/ECS',
                'ZZZ_QAT/Galax', 'ZZZ_QAT/Kllisre', 'ZZZ_QAT/Machinist', 'ZZZ_QAT/Maxsun',
                'ZZZ_QAT/OEM', 'ZZZ_QAT/SuperMicro', 'ZZZ_QAT/Winnfox', 'ZZZ_QAT/Zotac']

with open(EbayFileIdx, mode = 'r') as EbayFile:
    for line in EbayFile:
        t = line
        t = t.replace('  ', ' ')
        for i in EbayFileWordList:
            t = t.replace(i, '')
        EbayFileLineList.append (t)

PcFileList = []
PcFileNameList = []
#Clean and generate pc file list
for FolderName in FolderList:
    for filePath in [os.path.normpath(i) for i in glob.glob (os.path.join(FatherPath, FolderName, "*.stl"))]:
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
        PcFileNameList.append (t)
        PcFileList.append (filePath)
#Clean duplicate pc file
while True:
    check = False
    delete_list = []
    for i in range (len(PcFileList)-1):
        for j in range (i+1, len(PcFileList)):
            t = fuzz.partial_token_sort_ratio(PcFileNameList[i], PcFileNameList[j])
            if (t > 95):
                #print ("Found matching: [",t,"]:", PcFileNameList[i],"_", PcFileNameList[j])
                if len(PcFileNameList[i]) < len(PcFileNameList[j]):
                    delete_list.append(j)
                    #print ("Delete: ",PcFileList[j])
                else:
                    delete_list.append(i)
                    #print ("Delete: ",PcFileList[i])
    delete_list.sort()
    for i in reversed(delete_list):
        #print ("Deleted: ",i, PcFileList[i])
        del PcFileList[i]
        del PcFileNameList[i]
    break
#Match Ebay file with pc file
print ("Matching Ebay with pc")
print ("Printing badly matched files, or maybe file that hasn't been uploaded:")
print ("First la file on Ebay, Second la file on pc, third la score.")
for i in EbayFileLineList:
    matchResult = process.extractOne(i, PcFileNameList)
    if matchResult[1]<95:
        print (i)
print ("___________")
for i in EbayFileLineList:
    matchResult = process.extractOne(i, PcFileNameList)
    if matchResult[1]<95:
        print (matchResult[0])
print ("___________")
for i in EbayFileLineList:
    matchResult = process.extractOne(i, PcFileNameList)
    if matchResult[1]<95:
        print (matchResult[1])
print ("___________")
for i in EbayFileLineList:
    matchResult = process.extractOne(i, PcFileNameList)#, scorer=fuzz.partial_token_sort_ratio)
    if matchResult[1]<95:
        print (i,'\n',matchResult[0],'\n',matchResult[1])
    else:
        Remove_index = PcFileNameList.index(matchResult[0])
        #print (PcFileList[Remove_index],' ',PcFileNameList[Remove_index])
        PcFileNameList.pop(Remove_index)
        PcFileList.pop(Remove_index)
#print (EbayFileLineList)

dest_folder = r"Maybe Not Posted File"
os.makedirs(dest_folder, exist_ok=True)
for idx, path in enumerate(PcFileList):
    prefix = PcFileNameList[idx] + " ___ "
    new_name = prefix + os.path.basename(path)
    dest_path = os.path.join(dest_folder, new_name)
    shutil.copy2(path, dest_path)
    #shutil.copy2(path, dest_folder)


t = PcFileNameList
t.sort()
