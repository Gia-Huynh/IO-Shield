import meshlib.mrmeshpy as mr
def generate2DIO (InputPath, OutputPath, betterPrecision = 0):
	# load raster image:
	# find the boundary contour between black and white:
	# compute the triangulation inside the contour
	dm = mr.loadDistanceMapFromImage(mr.Path(InputPath), 0)
	polyline2 = mr.distanceMapTo2DIsoPolyline(dm, isoValue=10)
	IO_Shield_Mesh = mr.triangulateContours(polyline2.contours2())
	if (betterPrecision == 1):
		mr.subdivideMesh(IO_Shield_Mesh)

	#Thicken + resize
	test_matrix = mr.Matrix3f()
	test_matrix.x = mr.Vector3f(0.1025,0,0)
	test_matrix.y = mr.Vector3f(0,0.1025,0)
	test_matrix.z = mr.Vector3f(0,0,0.1)
	
	scale = mr.AffineXf3f()
	scale.A = test_matrix
	scale.b = mr.Vector3f(3,3.9,1)
	IO_Shield_Mesh.transform (scale)
	
	mr.addBaseToPlanarMesh(IO_Shield_Mesh, zOffset=1)

	#Comment out this part for a slower but more precise model
	testRelaxParam = mr.MeshRelaxParams()
	testRelaxParam.force = 0.01
	testRelaxParam.iterations = 10
	mr.relax (IO_Shield_Mesh, testRelaxParam)

	#Union is slow AF
	emptyIO = mr.loadMesh(mr.Path("GayModel.stl"))
	meshNigga = mr.boolean(IO_Shield_Mesh, emptyIO, mr.BooleanOperation.Union)
	mr.saveMesh(meshNigga.mesh, mr.Path(OutputPath))
	return None
if __name__ == "__main__":
    generate2DIO ("twoDimFile.png", "test.stl", 1)
