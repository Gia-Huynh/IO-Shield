import bpy

while bpy.data.objects:
    bpy.data.objects.remove(bpy.data.objects[0], do_unlink=True)

bpy.ops.import_mesh.stl (filepath = "Binary_coins.stl")
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.object.select_by_type(type='MESH')
#bpy.ops.mesh.select_all(action='SELECT')
#edit_obj = bpy.context.edit_object
bpy.ops.transform.resize (value = (0.205,0.205,1))


for collection in bpy.data.collections:
   print(collection.name)
   for obj in collection.all_objects:
      print("obj: ", obj.name)


"""a = bpy.context.active_object
cont = bpy.context.area.type
print(str(cont))
bpy.context.area.type = '?'"""
bpy.data.objects["Binary_coins"].select_set(True)
bpy.ops.object.mode_set(mode='EDIT')

bpy.ops.mesh.solidify (thickness = 1)
bpy.data.objects["Binary_coins"].select_set(True)
bpy.ops.object.mode_set(mode='EDIT')

bpy.data.objects["Binary_coins"].location.x += 3.9
bpy.data.objects["Binary_coins"].location.y += 3.9
bpy.data.objects["Binary_coins"].location.z += 1.0

bpy.ops.import_mesh.stl (filepath = "GayModel.stl")

#JOIN EVERYTHING
#https://blender.stackexchange.com/questions/76700/merge-multiple-meshes-into-one-single-mesh
#item='MESH'
#bpy.ops.object.select_all(action='DESELECT')
#bpy.ops.object.select_by_type(type=item)
#bpy.ops.object.join()

#Export
bpy.ops.export_mesh.stl (filepath = "ayowtf.stl")