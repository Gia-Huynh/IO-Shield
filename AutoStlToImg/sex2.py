#!/usr/bin/env python3
import os, math, argparse, numpy as np, trimesh, pyrender
from glob import glob
from PIL import Image
from tqdm import tqdm
from concurrent.futures import ProcessPoolExecutor

def cam_pose(az, el, dist):
    az, el = math.radians(az), math.radians(el)
    x, y, z = dist*math.cos(el)*math.cos(az), dist*math.cos(el)*math.sin(az), dist*math.sin(el)
    f = -np.array([x,y,z]); f /= np.linalg.norm(f)
    r = np.cross([0,0,1], f); r /= np.linalg.norm(r)
    u = np.cross(f, r)
    M = np.eye(4); M[:3,:3] = np.c_[r,u,f]; M[:3,3] = [x,y,z]
    return M

def render_one(stl, out, az, el, dist, w, h):
    try:
        m = trimesh.load(stl, force='mesh')
        m.merge_vertices(); m.fix_normals(); m = m.smoothed(normals=True)
        m.apply_translation(-m.centroid)
        m.apply_scale(1.0/(m.bounding_sphere.radius or 1))
        scene = pyrender.Scene(bg_color=(255,255,255), ambient_light=[.3]*3+[1])
        scene.add(pyrender.Mesh.from_trimesh(m, smooth=True))
        cam = pyrender.PerspectiveCamera(yfov=np.radians(60))
        pose = cam_pose(az, el, dist)
        scene.add(cam, pose=pose)
        scene.add(pyrender.DirectionalLight(intensity=3), pose=pose)
        r = pyrender.OffscreenRenderer(w,h)
        color, _ = r.render(scene); r.delete()
        Image.fromarray(color).save(out)
    except Exception as e: print("Fail", stl, e)

def main():
    a = argparse.ArgumentParser(); add=a.add_argument
    add("--input"); add("--output"); add("--az",type=float,default=45)
    add("--el",type=float,default=30); add("--dist",type=float,default=2.5)
    add("--size",nargs=2,type=int,default=[1024,768]); add("--workers",type=int,default=4)
    args=a.parse_args(); os.makedirs(args.output,exist_ok=True)
    files=sorted(glob(os.path.join(args.input,"*.stl")))
    tasks=[(f,os.path.join(args.output,os.path.splitext(os.path.basename(f))[0]+".png"),
            args.az,args.el,args.dist,args.size[0],args.size[1]) for f in files]
    with ProcessPoolExecutor(args.workers) as ex:
        list(tqdm(ex.map(lambda t: render_one(*t), tasks), total=len(tasks)))

if __name__=="__main__":
    main()
