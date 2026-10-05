"""UIClip (Wu et al., UIST'24) pairwise judge: before vs after, per screen.
Protocol from the model card: prefix 'ui screenshot. well-designed. ', sliding
224 windows averaged, cosine*100; pairwise preference = softmax over the two
images' scores for the same description."""
import sys, torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor
M="biglab/uiclip_jitteredwebsites-2-224-paraphrased_webpairs_humanpairs"
model=CLIPModel.from_pretrained(M).eval(); proc=CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
def emb(path):
    im=Image.open(path).convert('RGB'); w,h=im.size; s=224/min(w,h); im=im.resize((round(w*s),round(h*s)))
    w,h=im.size; L=max(w,h); n=max(1,-(-L//224)); step=(L-224)/max(1,n-1)
    crops=[im.crop((int(i*step),0,int(i*step)+224,224)) if w>=h else im.crop((0,int(i*step),224,int(i*step)+224)) for i in range(n)]
    with torch.no_grad(): e=model.visual_projection(model.vision_model(**proc(images=crops,return_tensors='pt')).pooler_output)
    e=e/e.norm(dim=-1,keepdim=True); e=e.mean(0); return e/e.norm()
desc="ui screenshot. well-designed. dark personal portfolio website of a machine learning engineer"
with torch.no_grad(): t=model.text_projection(model.text_model(**proc.tokenizer([desc],return_tensors='pt',padding=True)).pooler_output)[0]
t=t/t.norm()
tag=sys.argv[1]  # desk|mob
names="Home Sistemas Investigación OpenSource Trayectoria Enfoque Contacto".split()
for i,n in enumerate(names):
    a=100*emb(f'before-{tag}-{i}.png')@t; b=100*emb(f'after-{tag}-{i}.png')@t
    p=torch.softmax(torch.stack([a,b]),0)[1].item()
    print(f"{tag} {i} {n:13s} before={a:.2f} after={b:.2f}  P(after preferida)={p:.2f}")
