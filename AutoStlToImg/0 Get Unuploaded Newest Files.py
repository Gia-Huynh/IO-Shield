# copy_new_stl.py
import os
from pathlib import Path
from datetime import datetime
import shutil

timestamp_file = "0 timestamps.txt"
source_dir = Path("C:/Users/Za/Desktop/3D Printing/Shopee/IO Shield/") # root folder to search
destination_dir = Path("L:/IO-Shield/AutoStlToImg/Maybe Not Posted File/")
destination_dir.mkdir(parents=True, exist_ok=True)

# Load the newest timestamp
with open(timestamp_file) as f:
    lines = f.read().splitlines()
    if not lines:
        raise ValueError("No timestamp found!")
    newest_ts = datetime.fromisoformat(lines[-1])

# Recursively find .stl files newer than timestamp
for stl_path in source_dir.rglob("*.stl"):
    file_mtime = datetime.fromtimestamp(stl_path.stat().st_mtime)
    if file_mtime > newest_ts:
        dest_path = destination_dir / stl_path.name
        shutil.copy2(stl_path, dest_path)
        print(f"Copied: {stl_path} -> {dest_path}")
