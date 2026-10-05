"""Apply the trained UEyes readout to deck screenshots; attention share per AOI."""
import torch, torch.nn.functional as F, json, numpy as np, sys
from PIL import Image
from ueyes_feats import feats
import importlib.util
spec = importlib.util.spec_from_file_location('t', 'ueyes_train_defs.py'); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
DUR = '3s'
h = t.Head(); h.load_state_dict(torch.load(f'ueyes_head_{DUR}.pt')); h.eval()
names = 'Home Sistemas Investigación OpenSource Trayectoria Enfoque Contacto'.split()
def L(a): a = a / 255; a = np.where(a <= .04045, a / 12.92, ((a + .055) / 1.055) ** 2.4); return a @ [.2126, .7152, .0722]
out = {}
for tag in (sys.argv[1].split(',') if len(sys.argv)>1 else ['before','after']):
  for vp in (sys.argv[2].split(',') if len(sys.argv)>2 else ['desk', 'mob']):
    aoi = json.load(open(f'shots/{tag}-{vp}-aoi.json'))
    for s in range(7):
        im = Image.open(f'shots/{tag}-{vp}-sal-{s}.png').convert('RGB'); W, H = im.size
        with torch.no_grad(): lp = h(feats(im).float())
        sal = F.interpolate(lp.exp()[None, None], (H, W), mode='bilinear', align_corners=False)[0, 0].numpy(); sal /= sal.sum()
        masks = {}
        for k, boxes in aoi[s].items():
            m = np.zeros((H, W), bool)
            for x0, y0, x1, y1 in boxes: m[max(0,y0):min(H,y1), max(0,x0):min(W,x1)] = True
            masks[k] = m
        anytext = np.logical_or.reduce(list(masks.values()))
        bg = np.asarray(Image.open(f'shots/{tag}-{vp}-bg-{s}.png').convert('RGB'), np.float32)
        masks['cloud'] = (L(bg) > 0.012) & ~anytext   # visibly lit field, not under copy
        # exclusive attribution, priority order
        taken = np.zeros((H, W), bool); row = {}
        for k in (['focus'] if 'focus' in masks else []) + ['claim', 'cta', 'evidence', 'chrome', 'cloud']:
            m = masks[k] & ~taken; taken |= m
            mass = sal[m].sum(); area = m.mean()
            row[k] = (round(float(mass), 3), round(float(mass / area), 2) if area > 0 else None)
        row['rest'] = (round(float(sal[~taken].sum()), 3), None)
        out[f'{tag} {vp} {s} {names[s]}'] = row
        # overlay
        hm = (sal / sal.max()); ov = np.asarray(im, np.float32) * 0.45
        ov[..., 0] += 255 * hm * 0.9; ov[..., 1] += 200 * hm * 0.6
        Image.fromarray(np.clip(ov, 0, 255).astype(np.uint8)).save(f'shots/sal-{tag}-{vp}-{s}.png')
for k, v in out.items(): print(k.ljust(30), '  '.join(f"{a}:{m}{'' if l is None else f'(x{l})'}" for a, (m, l) in v.items()))
json.dump(out, open('shots/saliency.json', 'w'))
