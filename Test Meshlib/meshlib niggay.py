from meshlib import mrmeshpy

# load closed mesh
print ("load")
closedMesh = mrmeshpy.loadMesh("B350M MORTAR.stl")

# load non-closed mesh
nonClosedMesh = mrmeshpy.loadMesh("B350M MORTAR.stl")
print ("DONE load")


# setup offset parameters
params = mrmeshpy.OffsetParameters()
params.voxelSize = 0.04
params.type = mrmeshpy.OffsetParametersType.Offset # requires closed mesh

print ("create positive offset mesh")
# create positive offset mesh
posOffset = mrmeshpy.offsetMesh(closedMesh, 0.1, params)

print ("create negative offset mesh")
# create negative offset mesh
negOffset = mrmeshpy.offsetMesh(closedMesh, -0.1, params)


# change offset mode to `Shell`
params.type = mrmeshpy.OffsetParametersType.Shell # does not require closed mesh
print ("create shell mesh")
# create shell mesh
#shell = mrmeshpy.offsetMesh(nonClosedMesh, 0.1, params)

# save results
print ("Saving")
mrmeshpy.saveMesh(posOffset, "posOffset.stl")
mrmeshpy.saveMesh(negOffset, "negOffset.stl")
#mrmeshpy.saveMesh(shell, "shell.stl")
print ("DONE")
