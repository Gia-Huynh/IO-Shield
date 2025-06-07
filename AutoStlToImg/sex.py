import trimesh
import pyrender
import numpy as np
import os

def render_stl_screenshot(stl_path, output_path, angle=30):
    # Load STL file
    mesh = trimesh.load_mesh(stl_path)
    #mesh.apply_transform(trimesh.transformations.rotation_matrix(
     #   np.radians(angle), [0, 1, 0]  # Rotate around Y-axis
    #))

    # Convert to pyrender mesh
    scene = pyrender.Scene()
    mesh = pyrender.Mesh.from_trimesh(mesh)
    scene.add(mesh)

    # Add camera and light
    camera = pyrender.PerspectiveCamera(yfov=np.pi / 4)
    light = pyrender.DirectionalLight(color=np.array ([1,0.75,0.9]), intensity=3.0)
    scene.add(camera, pose=[[1, 0, 0, 80], [0, 1, 0, 20], [0, 0, 1, 225], [0, 0, 0, 1]])
    """scene.add(camera, pose=[[200, 0, 0, 80], #[Height,???,???,Move Camera Right]
                            [0, 150, 0, 20], #[Rotate???, Vertical Scale, ???, Move Camera Down]
                            [0, 0, 50, 70], #[?,, Inverse Z Scales,Z-axis movement]
                            [0, 0, 0, 1]])"""
    scene.add(light, pose=[[1, 0, 0, 50], [0, 1, 0, 50], [0, 0, 1, 100], [0, 0, 0, 1]])

    # Render the scene
    renderer = pyrender.OffscreenRenderer(800, 800)
    color, _ = renderer.render(scene)
    renderer.delete()

    # Save the image
    from PIL import Image
    Image.fromarray(color).save(output_path)

# Example usage
stl_file = "example.stl"
output_image = "screenshot.png"
render_stl_screenshot(stl_file, output_image)
