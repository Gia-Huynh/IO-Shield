import gay_code as gayy
import Meshlib as ml
import Blender as bl

data_path = "./Data/"
circle_path = "./CircleDetection/"
erosion_path = "./CoolErosion/"
meshlib_path = "./MeshLib/"
stl_path = "./stl/"
if  __name__ == "__main__":
		contrast_ratio = 1
		brightness_value = 0
		blur_ratio = 0.0075
		CoNhiPhanTime = 1
		
		right_padding = 15
		bottom_padding = 5
		left_padding = 15
		for gay_file in glob.glob (data_path+"*.*"):
			file_name = os.path.basename(gay_file).split(".")[-2]
			gay_image = gayy.contrast (gayy.brightness(cv2.imread (gay_file),brightness_value), contrast_ratio)
			ye = gayy.niggaBFS (gay_image, CoNhiPhanTime, blur_ratio, file_name)
			ye = gayy.PaddingCleaning (ye, right_padding, bottom_padding, left_padding, file_name)
			plt.imsave(erosion_path + file_name + "_ero.png",255-ye,cmap='gray')
			ml.generate2DIO (erosion_path + file_name + "_ero.png", meshlib_path + file_name + ".stl", betterPrecision = 0)
			bl.mergeModel (meshlib_path + file_name + ".stl", stl_path + file_name + ".stl", file_name, emptyIOPath = "GayModel.stl")
