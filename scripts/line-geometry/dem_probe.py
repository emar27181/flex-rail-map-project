# 国土地理院DEMタイル: 利用可能なz/レイヤーを実測し、line_geo_elev.py を自動修正する
import urllib.request, math, io, sys
from PIL import Image

def tile_xy(lat, lon, z):
    n = 2 ** z
    x = int((lon + 180) / 360 * n)
    y = int((math.degrees(math.atan2(math.sinh(math.radians(lat)), math.cos(math.radians(lat)))) + 90) / 180 * n)
    return x, y

def dec(img, lat, lon, z):
    fx = (lon + 180) / 360 * (2 ** z) * 256
    fy = (math.degrees(math.atan2(math.sinh(math.radians(lat)), math.cos(math.radians(lat)))) + 90) / 180 * (2 ** z) * 256
    px = min(max(int(fx % 256), 0), 255); py = min(max(int(fy % 256), 0), 255)
    r, g, b = img.getpixel((px, py))[:3]
    v = (r * 65536 + g * 256 + b) * 0.01 - 10000
    return round(v, 1) if -100 < v < 4500 else None

checks = [('tokyo', 35.6812, 139.7671, (2, 12)), ('takao', 35.6251, 139.2436, (560, 640))]
best = None
for z in (14, 13, 12):
    for layer in ('dem', 'dem_png'):
        ok = 0; vals = {}
        for name, la, lo, rng in checks:
            x, y = tile_xy(la, lo, z)
            url = f'https://cyberjapandata.gsi.go.jp/xyz/{layer}/{z}/{x}/{y}.png'
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                data = urllib.request.urlopen(req, timeout=15).read()
                if len(data) < 100:
                    vals[name] = f'EMPTY({len(data)})'; continue
                img = Image.open(io.BytesIO(data)).convert('RGB')
                v = dec(img, la, lo, z)
                vals[name] = v
                if v is not None and rng[0] <= v <= rng[1]:
                    ok += 1
            except Exception as e:
                vals[name] = 'ERR:' + str(e)[:40]
        print(f'z={z} {layer}: pass={ok}/2 {vals}')
        if ok == 2 and best is None:
            best = (z, layer)
print('BEST', best)
if best is None:
    print('ALL_TILE_PROBES_FAILED')
    sys.exit(1)
p = 'flex-railway-map/scripts/line_geo_elev.py'
s = open(p, encoding='utf-8').read()
s = s.replace('Z = 15', f'Z = {best[0]}')
s = s.replace("LAYERS = ['dem', 'dem_png']", f"LAYERS = ['{best[1]}', '{'dem_png' if best[1] == 'dem' else 'dem'}']")
s = s.replace("os.path.join(BASE, 'dem_cache', 'z15')", f"os.path.join(BASE, 'dem_cache', 'z{best[0]}')")
s = s.replace('z15 DEMタイル', f'z{best[0]} DEMタイル')
open(p, 'w', encoding='utf-8').write(s)
print(f'PATCHED Z={best[0]} LAYERS={best[1]} first')
