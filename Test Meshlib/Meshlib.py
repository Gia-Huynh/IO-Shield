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

    #Thicken
    mr.addBaseToPlanarMesh(mesh, zOffset=10)
    mesh.transform (mr.AffineXf3f(0.1,0.1,0.1))

    emptyIO = mr.loadMesh(mr.Path("GayModel.stl"))
    meshNigga = mr.boolean(mesh, emptyIO, mr.BooleanOperation.Union)
    mr.saveMesh(meshNigga.mesh, mr.Path(OutputPath))
if __name__ == "__main__":
    generate2DIO ("twoDimFile.png", "test.stl", 1)
