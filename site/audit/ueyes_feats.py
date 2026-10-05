import torch, glob, os, numpy as np, csv
from PIL import Image
from transformers import AutoModel
torch.set_num_threads(4)
m = AutoModel.from_pretrained('facebook/dinov2-small', output_hidden_states=True).eval()
MEAN = torch.tensor([0.485,0.456,0.406]).view(3,1,1); STD = torch.tensor([0.229,0.224,0.225]).view(3,1,1)
AREA = 448*448
def prep(im):
    w,h = im.size; s = (AREA/(w*h))**0.5
    W = max(14, round(w*s/14)*14); H = max(14, round(h*s/14)*14)
    x = torch.from_numpy(np.asarray(im.convert('RGB').resize((W,H), Image.BICUBIC))).permute(2,0,1).float()/255
    return ((x-MEAN)/STD)[None], H//14, W//14
@torch.no_grad()
def feats(im):
    x,gh,gw = prep(im); o = m(pixel_values=x)
    hs = [o.hidden_states[i][0,1:] for i in (8,12)]  # drop CLS
    f = torch.cat(hs,-1).reshape(gh,gw,-1).permute(2,0,1)
    return f.half()
if __name__ == '__main__':
    os.makedirs('ueyesfeat', exist_ok=True)
    rows = list(csv.DictReader(open('ueyesdata/image_types.csv'), delimiter=';'))
    for i,r in enumerate(rows):
        n = r['Image Name']; out = f'ueyesfeat/{n}.pt'
        if os.path.exists(out) or not os.path.exists(f'ueyesdata/images/{n}'): continue
        torch.save(feats(Image.open(f'ueyesdata/images/{n}')), out)
        if i % 200 == 0: print(i, flush=True)
    print('done')
