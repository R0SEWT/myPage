"""Saliency readout on frozen DINOv2-S features, trained on UEyes (Jiang et al., CHI'23)
official Train split, evaluated on the official Test split against a centre-bias-only
baseline. Metrics: CC and KLD at feature-grid resolution (standard MIT/Tuebingen defs)."""
import torch, torch.nn as nn, torch.nn.functional as F, csv, numpy as np, os, sys, random
from PIL import Image
torch.manual_seed(0); random.seed(0); torch.set_num_threads(4)
DUR = sys.argv[1] if len(sys.argv) > 1 else '3s'
rows = [r for r in csv.DictReader(open('ueyesdata/image_types.csv'), delimiter=';') if os.path.exists(f"ueyesfeat/{r['Image Name']}.pt")]
def load(r):
    f = torch.load(f"ueyesfeat/{r['Image Name']}.pt").float()
    gh, gw = f.shape[1:]
    g = np.asarray(Image.open(f"ueyesdata/saliency_maps/heatmaps_{DUR}/{r['Image Name']}").convert('L').resize((gw, gh), Image.BOX), dtype=np.float32)
    g = torch.from_numpy(g) + 1e-6; g = g / g.sum()
    return f, g, r['Category']
data = [(load(r), r['Train/Test']) for r in rows]
train = [d for d, s in data if s == 'Train']; test = [d for d, s in data if s == 'Test']
print(len(train), len(test), flush=True)

class Bias(nn.Module):
    """Learned centre/position prior on a 24x24 normalised grid, resized to any grid."""
    def __init__(s): super().__init__(); s.b = nn.Parameter(torch.zeros(1, 1, 24, 24))
    def forward(s, gh, gw): return F.interpolate(s.b, (gh, gw), mode='bilinear', align_corners=False)[0, 0]
class Head(nn.Module):
    def __init__(s, c=768):
        super().__init__()
        s.net = nn.Sequential(nn.Conv2d(c, 96, 1), nn.GELU(), nn.Conv2d(96, 32, 3, padding=1), nn.GELU(), nn.Conv2d(32, 1, 3, padding=1))
        s.bias = Bias()
    def forward(s, f, use_feat=True):
        gh, gw = f.shape[1:]
        x = s.bias(gh, gw)
        if use_feat: x = x + s.net(f[None])[0, 0]
        return F.log_softmax(x.flatten(), 0).view(gh, gw)
def cc(p, g):
    p = p - p.mean(); g = g - g.mean(); return (p * g).sum() / (p.norm() * g.norm() + 1e-9)
def kld(logp, g): return (g * (torch.log(g) - logp)).sum()
def fit(use_feat, epochs):
    h = Head(); opt = torch.optim.AdamW(h.parameters(), 3e-4 if use_feat else 3e-2, weight_decay=1e-4)
    for ep in range(epochs):
        random.shuffle(train); tot = 0
        for f, g, _ in train:
            lp = h(f, use_feat); loss = kld(lp, g) - 2 * cc(lp.exp(), g)
            opt.zero_grad(); loss.backward(); opt.step(); tot += loss.item()
        print(('model' if use_feat else 'bias'), ep, round(tot / len(train), 4), flush=True)
    return h
@torch.no_grad()
def evaluate(h, use_feat):
    res = {}
    for f, g, cat in test:
        lp = h(f, use_feat); res.setdefault(cat, []).append((cc(lp.exp(), g).item(), kld(lp, g).item()))
    allv = [v for vs in res.values() for v in vs]
    out = {c: (round(float(np.mean([a for a, _ in v])), 3), round(float(np.mean([b for _, b in v])), 3)) for c, v in res.items()}
    out['all'] = (round(float(np.mean([a for a, _ in allv])), 3), round(float(np.mean([b for _, b in allv])), 3))
    return out
hb = fit(False, 6); hm = fit(True, 8)
print('TEST (CC↑, KLD↓) centre-bias only:', evaluate(hb, False))
print('TEST (CC↑, KLD↓) DINOv2 readout   :', evaluate(hm, True))
torch.save(hm.state_dict(), f'ueyes_head_{DUR}.pt')
