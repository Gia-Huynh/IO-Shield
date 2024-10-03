import meshlib.mrmeshpy as mr
import os
def generate2DIO (InputPath, OutputPath, betterPrecision = 0, thickness = 1.5):
	# load raster image:
	# find the boundary contour between black and white:
	# compute the triangulation inside the contour
	dm = mr.loadDistanceMapFromImage(os.path.abspath(InputPath), 0)
	polyline2 = mr.distanceMapTo2DIsoPolyline(dm, isoValue=10)
	nigger = mr.HolesVertIds ()
	IO_Shield_Mesh = mr.triangulateContours(polyline2.contours2(nigger))
	#if (betterPrecision == 1):
                #mr.subdivideMesh(IO_Shield_Mesh)

	#Thicken + resize
	test_matrix = mr.Matrix3f()
	#test_matrix.x = mr.Vector3f(0.11325,0,0) #working
	test_matrix.x = mr.Vector3f(0.1145,0,0) #length-wise
	test_matrix.y = mr.Vector3f(0,0.1125,0) #nigga-wise
	test_matrix.z = mr.Vector3f(0,0,0.1) #height-wise
	
	#https://doc.meshinspector.com/classAffineXf3f.html
	#AffineXf3f: affine transformation: y = A*x + b, where A in VxV, and b in V
	scale = mr.AffineXf3f()
	scale.A = test_matrix
	#scale.b = mr.Vector3f(2,2,thickness) #working
	scale.b = mr.Vector3f(1.2,2,thickness)
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
