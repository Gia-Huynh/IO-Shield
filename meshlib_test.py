import meshlib.mrmeshpy as mr
# load raster image:
dm = mr.loadDistanceMapFromImage(mr.Path("./CoolErosion/B350M MORTAR_ero.png"), 0)
# find the boundary contour between black and white:
polyline2 = mr.distanceMapTo2DIsoPolyline(dm, isoValue=10)
# compute the triangulation inside the contour
mesh = mr.triangulateContours(polyline2.contours2())
mr.subdivideMesh(mesh)
mr.saveMesh(mesh, mr.Path("Binary_coins.stl"))