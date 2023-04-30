import gay_code as gayy
import Meshlib as ml
import glob, os
from matplotlib.pyplot import imsave
data_path = "./Data/"
circle_path = "./CircleDetection/"
erosion_path = "./CoolErosion/"
meshlib_path = "./MeshLib/"
stl_path = "./stl/"

def singleImageBFS (input_path, output_path):
	contrast_ratio = 1
	brightness_value = 0
	blur_ratio = 0.0075
	CoNhiPhanTime = 1

	right_padding = 86
	bottom_padding = 5
	left_padding = 96

	file_name = os.path.basename(input_path).split(".")[-2]
	gay_image = gayy.contrast (gayy.brightness(gayy.readImg(input_path),brightness_value), contrast_ratio)

	ye = gayy.niggaBFS (gay_image, CoNhiPhanTime, blur_ratio, file_name)
	ye = gayy.PaddingCleaning (ye, right_padding, bottom_padding, left_padding, file_name)
	#imsave("Data/DebugData/" + file_name + "_ero.png",255-ye,cmap='gray')
	
	imsave(output_path,255-ye,cmap='gray')
	return None

def singleImage3DStl (input_path, output_path):
    ml.generate2DIO (input_path, output_path, betterPrecision = 0)
    #ml.generate2DIO (input_path, "./temp2Dstl.stl", betterPrecision = 0)
    #bl.mergeModel ("temp2Dstl.stl", "threeDimFile.stl", "temp2Dstl", emptyIOPath = "GayModel.stl")
    return None
if  __name__ == "__main__":
		singleImageBFS ("./Data/image.png", "./Data/temp2D.png")
		singleImage3DStl ("./Data/temp2D.png", "./result.stl")
		"""for gay_file in glob.glob (data_path+"*.*"):
			file_name = os.path.basename(gay_file).split(".")[-2]
			gay_image = gayy.contrast (gayy.brightness(gayy.readImg(gay_file),brightness_value), contrast_ratio)
			ye = gayy.niggaBFS (gay_image, CoNhiPhanTime, blur_ratio, file_name)
			ye = gayy.PaddingCleaning (ye, right_padding, bottom_padding, left_padding, file_name)
			imsave(erosion_path + file_name + "_ero.png",255-ye,cmap='gray')
			ml.generate2DIO (erosion_path + file_name + "_ero.png", meshlib_path + file_name + ".stl", betterPrecision = 0)
			bl.mergeModel (meshlib_path + file_name + ".stl", stl_path + file_name + ".stl", file_name, emptyIOPath = "GayModel.stl")"""
