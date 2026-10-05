from remotezip import RemoteZip
from concurrent.futures import ThreadPoolExecutor
import os, threading
URL='https://zenodo.org/api/records/8010312/files/UEyes_dataset.zip/content'
z0=RemoteZip(URL); names=[n for n in z0.namelist() if '__MACOSX' not in n and '/._' not in n and not n.endswith('/') and not n.endswith('.DS_Store')]
want=[n for n in names if n.startswith(('UEyes_dataset/images/','UEyes_dataset/saliency_maps/heatmaps_1s/','UEyes_dataset/saliency_maps/heatmaps_3s/')) or n.endswith('image_types.csv')]
print(len(want), flush=True)
local=threading.local()
def get(n):
    out='ueyesdata/'+n.replace('UEyes_dataset/','')
    if os.path.exists(out): return
    if not hasattr(local,'z'): local.z=RemoteZip(URL)
    os.makedirs(os.path.dirname(out),exist_ok=True)
    for t in range(4):
        try: open(out,'wb').write(local.z.read(n)); return
        except Exception as e: err=e
    print('fail',n,err,flush=True)
with ThreadPoolExecutor(16) as ex:
    for i,_ in enumerate(ex.map(get,want)):
        if i%500==0: print(i,flush=True)
print('done')
