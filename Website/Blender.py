import bpy

def mergeModel (InputPath, OutputPath, filename, emptyIOPath = "GayModel.stl"):
	while bpy.data.objects:
		bpy.data.objects.remove(bpy.data.objects[0], do_unlink=True)
	
	
	bpy.ops.object.camera_add(location=(0, 4, 4), 
                          rotation=(-0.7853, 0, 0))
	bpy.context.scene.camera = bpy.context.object
	
	
	ctx = bpy.context.copy()
	bpy.ops.render.render('INVOKE_DEFAULT')
	###This is handled with some handlers, but essentially seems to work with a simple context copy
	#for s in bpy.data.scenes:
	#	if s == my_scene:
	#		ctx['window'].scene = s
			
	while bpy.data.objects:
		bpy.data.objects.remove(bpy.data.objects[0], do_unlink=True)

	bpy.ops.import_mesh.stl (filepath = InputPath)
	bpy.ops.object.select_all(action='SELECT')
	bpy.ops.object.select_all(action='DESELECT')
	bpy.ops.object.select_by_type(type='MESH')


	bpy.ops.transform.resize (value = (0.1025,0.1025,1))
	bpy.data.objects[filename].select_set(True)
	bpy.ops.object.mode_set(mode='EDIT')
	print ("YAY")
	bpy.ops.mesh.solidify (thickness = 1)
	bpy.data.objects[filename].select_set(True)
	bpy.ops.object.mode_set(mode='EDIT')

	#Trái phải (nhìn IO shield nằm ngang)
	bpy.data.objects[filename].location.x += 3
	#Lên xuống (với IO shield nằm ngang)		
	bpy.data.objects[filename].location.y += 3.9
	bpy.data.objects[filename].location.z += 1.0
	bpy.ops.object.mode_set(mode='OBJECT')

	bpy.ops.import_mesh.stl (filepath = emptyIOPath)

	#Export
	bpy.ops.export_mesh.stl (filepath = OutputPath)
