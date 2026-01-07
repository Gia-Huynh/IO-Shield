import trimesh
import pyrender
import numpy as np
import os
from PIL import Image

def render_stl_screenshot(stl_path, output_path, output_path_2, angle=30):
    # Load STL file
    mesh = trimesh.load_mesh(stl_path)
    #mesh.apply_transform(trimesh.transformations.rotation_matrix(
     #   np.radians(angle), [0, 1, 0]  # Rotate around Y-axis
    #))

    # Convert to pyrender mesh
    scene = pyrender.Scene()
    mesh.merge_vertices()
    mesh.fix_normals()
    mesh = mesh.smooth_shaded#mesh.smoothed(normals=True)
    mesh = pyrender.Mesh.from_trimesh(mesh)
    scene.add(mesh)

    # Add camera and light
    camera = pyrender.PerspectiveCamera(yfov=np.pi / 4)
    light = pyrender.DirectionalLight(color=np.array ([1,0.75,0.9]), intensity=3.0)
    """scene.add(camera, pose=
           [[200, 0, 0, 80], #[Hori Scale         , RotateZ + Z-Offset , RotateHorizon   , Move Camera Right]
            [0, 150, 0, 20], #[-RotateZ + Z-Offset, Vertical Scale     , RotateVertical  , Move Camera UP]
            [0, 0, 50, 70],  #[RotateHorizon      ,  RotateVertical    , Inverse Z Scales, Move Camera Backward]
            [0, 0, 0, 1]])   #Bottom row of matrix must be [0,0,0,1]   """
   
    scene.add(light, pose=[[1, 0, 0, 50],[0, 1, 0, 50],[0, 0, 1, 100],[0, 0, 0, 1]]) #fine 
    #scene.add(camera, pose=[[1, 0, 0, 80], [0, 1, 0, 20], [0, 0, 1, 225], [0, 0, 0, 1]]) #fine
    nc = pyrender.Node(camera=camera, matrix=[[1, 0, 0, 80], [0, 1, 0, 20], [0, 0, 1, 225], [0, 0, 0, 1]])
    scene.add_node(nc)
    # Render the scene
    renderer = pyrender.OffscreenRenderer(1000, 1000)
    color, _ = renderer.render(scene)
    renderer.delete()
    Image.fromarray(color).save(output_path)
    scene.remove_node(nc)

    camera2 = pyrender.PerspectiveCamera(yfov=np.pi / 4)
    #scene.add(camera2, pose=[[   1,-0.2,      0,  -5],
    #                        [   0,   1,   -0.8, -52],
    #                        [ 0.9,   0,      1, 160],
    #                        [   0,   0,      0,  1]])
    nc = pyrender.Node(camera=camera, matrix=[[   1,-0.2,      0,  -5],
                            [   0,   1,   -0.8, -52],
                            [ 0.9,   0,      1, 160],
                            [   0,   0,      0,  1]])
    scene.add_node(nc)
    
    renderer = pyrender.OffscreenRenderer(1000, 1000)
    color, _ = renderer.render(scene)
    renderer.delete()
    Image.fromarray(color).save(output_path_2)
# Example usage
if __name__ == "__main__":
    stl_file = "example.stl"
    output_path = "screenshot.png"
    render_stl_screenshot(stl_file, output_path, output_path_2)
