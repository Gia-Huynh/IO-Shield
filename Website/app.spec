# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['L:\\IO-Shield\\Website\\app.py'],
    pathex=[],
    binaries=[],
    datas=[('L:\\IO-Shield\\Website\\static', 'static/'), ('L:\\IO-Shield\\Website\\templates', 'templates/'), ('L:\\IO-Shield\\Website\\Cleaned.py', '.'), ('L:\\IO-Shield\\Website\\gay_code.py', '.'), ('L:\\IO-Shield\\Website\\GayModel.stl', '.'), ('L:\\IO-Shield\\Website\\MeshlibCode.py', '.'), ('L:\\IO-Shield\\Website\\running_config.txt', '.')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='app',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='app',
)
