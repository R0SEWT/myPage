#!/usr/bin/env bash
# attention.sh <pr-slug> [screens e.g. "1 2 3 4 5 6"]
# Captures base (4322) and branch (4321), runs the UEyes readout, writes
# before|after attention-mask composites and a lift table into docs/audit/<slug>/.
set -e
SLUG=$1; SCREENS=${2:-"1 2 3 4 5 6"}
B=att-${SLUG}-b; A=att-${SLUG}-a
cd /tmp/claude-0/shots
for vp in desk mob; do
  CHROMIUM=/opt/pw-browsers/chromium VP=$vp TAG=$B URL=http://localhost:4322/ timeout 300 node aoi.mjs >/dev/null 2>&1
  CHROMIUM=/opt/pw-browsers/chromium VP=$vp TAG=$A URL=http://localhost:4321/ timeout 300 node aoi.mjs >/dev/null 2>&1
done
cd /tmp/claude-0 && timeout 1500 uivenv/bin/python ueyes_audit.py $B,$A 2>/dev/null | grep -E "^att-" > /tmp/claude-0/att-$SLUG.txt
uivenv/bin/python - "$SLUG" "$B" "$A" "$SCREENS" <<'PY'
import sys, os
from PIL import Image, ImageDraw, ImageFont
slug, B, A, screens = sys.argv[1], sys.argv[2], sys.argv[3], [int(x) for x in sys.argv[4].split()]
out = f'/home/user/myPage/docs/audit/{slug}'; os.makedirs(out, exist_ok=True)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
for vp in ['desk', 'mob']:
    for s in screens:
        a = Image.open(f'/tmp/claude-0/shots/sal-{B}-{vp}-{s}.png').convert('RGB'); b = Image.open(f'/tmp/claude-0/shots/sal-{A}-{vp}-{s}.png').convert('RGB')
        k = 0.5 if vp == 'desk' else 0.8
        a, b = (im.resize((int(im.width*k), int(im.height*k)), Image.LANCZOS) for im in (a, b))
        o = Image.new('RGB', (a.width*2+12, a.height+34), (24, 26, 26)); d = ImageDraw.Draw(o)
        d.text((8, 6), 'ANTES · atención 3 s', fill=(230,120,120), font=f); d.text((a.width+20, 6), 'DESPUÉS · atención 3 s', fill=(90,220,160), font=f)
        o.paste(a, (0, 34)); o.paste(b, (a.width+12, 34)); o.save(f'{out}/attention-{vp}-s{s}.jpg', quality=76, optimize=True)
PY
cat /tmp/claude-0/att-$SLUG.txt
