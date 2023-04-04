import meshlib.mrmeshpy as mr
def generate2DIO (InputPath, OutputPath, betterPrecision = 0):
	# load raster image:
	dm = mr.loadDistanceMapFromImage(mr.Path(InputPath), 0)
	# find the boundary contour between black and white:
	polyline2 = mr.distanceMapTo2DIsoPolyline(dm, isoValue=10)
	# compute the triangulation inside the contour
	mesh = mr.triangulateContours(polyline2.contours2())
	#better precision?
	if (betterPrecision == 1):
		mr.subdivideMesh(mesh)
	mr.saveMesh(mesh, mr.Path(OutputPath))
