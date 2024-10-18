import gay_code as gayy
import MeshlibCode as ml
import glob, os
from matplotlib.pyplot import imsave
data_path = "./Data/"
circle_path = "./CircleDetection/"
erosion_path = "./CoolErosion/"
meshlib_path = "./MeshLib/"
stl_path = "./stl/"

def singleImageBFS (input_path, output_path,
 left_padding = 15, right_padding = 10, bottom_padding = 5, top_padding = 5,
 erosion = 0, blur_ratio = 0.005, #0075
 debug_mode = 0):
	contrast_ratio = 1
	brightness_value = 0
	CoNhiPhanTime = erosion

	file_name = os.path.basename(input_path).split(".")[-2]
	gay_image = gayy.contrast (gayy.brightness(gayy.readImg(input_path),brightness_value), contrast_ratio)

	ye = gayy.niggaBFS (gay_image, CoNhiPhanTime, blur_ratio, file_name, debug_mode)
	ye = gayy.PaddingCleaning (ye, right_padding, bottom_padding, left_padding, top_padding, file_name, debug_mode)
	if (debug_mode == 1):
		imsave("Data/DebugData/7_" + file_name + "_ero.png",255-ye,cmap='gray')
	
	imsave(output_path,255-ye,cmap='gray')
	return None

def singleImage3DStl (input_path, output_path, betterPrecision = 0, thickness = 2):
    ml.generate2DIO (input_path, output_path, betterPrecision, thickness)
    return None
if  __name__ == "__main__":
		singleImageBFS ("./Data/image.png", "./Data/temp2D.png")
		singleImage3DStl ("./Data/temp2D.png", "./result.stl")
