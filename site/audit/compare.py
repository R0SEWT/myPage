"""Compose before|after pairs into light JPEGs for PR bodies.
   python audit/compare.py BEFORE_DIR AFTER_DIR OUT_DIR [names...]"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
bdir, adir, out = sys.argv[1:4]; os.makedirs(out, exist_ok=True)
names = sys.argv[4:] or sorted(f for f in os.listdir(adir) if f.endswith('.png'))
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except Exception: font = ImageFont.load_default()
for n in names:
    a, b = Image.open(os.path.join(bdir, n)).convert('RGB'), Image.open(os.path.join(adir, n)).convert('RGB')
    s = 0.5 if a.width > 800 else 0.8
    a, b = (im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS) for im in (a, b))
    gap = 12; W = a.width + b.width + gap; H = max(a.height, b.height) + 34
    o = Image.new('RGB', (W, H), (24, 26, 26)); d = ImageDraw.Draw(o)
    d.text((8, 5), 'ANTES', fill=(230, 120, 120), font=font); d.text((a.width + gap + 8, 5), 'DESPUÉS', fill=(90, 220, 160), font=font)
    o.paste(a, (0, 34)); o.paste(b, (a.width + gap, 34))
    o.save(os.path.join(out, n.replace('.png', '.jpg')), quality=78, optimize=True)
    print(n)
