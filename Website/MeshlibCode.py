import meshlib.mrmeshpy as mr
import os
def generate2DIO (InputPath, OutputPath, betterPrecision = 0, thickness = 2):
	# load raster image:
	# find the boundary contour between black and white:
	# compute the triangulation inside the contour
	dm = mr.loadDistanceMapFromImage(os.path.abspath(InputPath), 0)
	polyline2 = mr.distanceMapTo2DIsoPolyline(dm, isoValue=10)
	nigger = mr.HolesVertIds ()
	IO_Shield_Mesh = mr.triangulateContours(polyline2.contours2(nigger))
	#if (betterPrecision == 1):
                #mr.subdivideMesh(IO_Shield_Mesh)
	IO_Shield_Mesh = mr.mergeCoplanarFaces(
            IO_Shield_Mesh,
            angle=1e-5,          # max angle (radians) between face normals
            area=0.0             # optional: ignore tiny faces threshold
        )
	#Thicken + resize
	test_matrix = mr.Matrix3f()
	#test_matrix.x = mr.Vector3f(0.11325,0,0) #working
	#test_matrix.x = mr.Vector3f(0.1145,0,0)
	#test_matrix.x = mr.Vector3f(0.11575,0,0) #almost PERFECT #1.
	
	#offset_matrix = mr.Vector3f(2,2,thickness) #working
	#offset_matrix = mr.Vector3f(1.2,2,thickness) #working
	#offset_matrix = mr.Vector3f(0.8,2,thickness) #almost PERFECT #1.

	# Note for Gia in the future: Khó vãi loz mà chưa chắc khách hàng apprieciate mình.
	# Mình còn chưa account for cái variation due to perspective nữa.

	# Backup PERFECT #2, cai nay kha ok nhung ma check lai B460M Asus voi tin nhan cua jaty7481.
	# Thùng máy dựng đứng thì:
	#   Theo chiều dọc thì mớ port ở trên là perfect,
	#    nhưng port dưới có lỗ bị lệch qua phải.
	#   Còn theo chiều ngang thì cần dịch bọn nó qua phải tí xíu xiu.
	"""test_matrix.x = mr.Vector3f(0.11481,0,0) #length-wise, chiều dài
	test_matrix.y = mr.Vector3f(0,0.1125,0) #width-wise, chiều ngắn
	test_matrix.z = mr.Vector3f(0,0,0.1) #height-wise, chiều cao
	offset_matrix = mr.Vector3f(0.9,2,thickness) #almost PERFECT #2."""

	# Scale chiều dài lại: 0.99063756259%, và offset chiều dài giảm -0.33441118906
	# Chiều ngắn thì chưa tính

	#Testing scaling chiều dài và offset chiều dài
	test_matrix.x = mr.Vector3f(0.11373509856,0,0) #length-wise, chiều dài
	test_matrix.y = mr.Vector3f(0,0.1125,0) #width-wise, chiều ngắn
	test_matrix.z = mr.Vector3f(0,0,0.1) #height-wise, chiều cao
	offset_matrix = mr.Vector3f(0.58714129921,2,thickness) # Lố qua phải 0.334
	offset_matrix = mr.Vector3f(-0.33385870079,2,thickness) # Lố qua trái 0.587
	offset_matrix = mr.Vector3f(0.25315,2,thickness) # 
	
	# https://doc.meshinspector.com/classAffineXf3f.html
	# AffineXf3f: affine transformation: y = A*x + b, where A in VxV, and b in V
	scale = mr.AffineXf3f()
	scale.A = test_matrix
	scale.b =  offset_matrix 
	
	IO_Shield_Mesh.transform (scale)
	mr.addBaseToPlanarMesh(IO_Shield_Mesh, zOffset=thickness)

	if (betterPrecision == 0):
		#Comment out this part for a slower but more precise model
		testRelaxParam = mr.MeshRelaxParams()
		testRelaxParam.force = 0.01
		testRelaxParam.iterations = 10
		mr.relax (IO_Shield_Mesh, testRelaxParam)

	#Union is slow AF
	emptyIO = mr.loadMesh(os.path.abspath("GayModel.stl"))
	meshNigga = mr.boolean(IO_Shield_Mesh, emptyIO, mr.BooleanOperation.Union)
	mr.saveMesh(meshNigga.mesh, os.path.abspath(OutputPath))
	return None
if __name__ == "__main__":
    generate2DIO ("twoDimFile.png", "test.stl", 1)
