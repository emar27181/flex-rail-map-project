# 線形JSON(2D)に標高を付与し3D化+駅標高ファイルを生成する。
# ソース自動選定: ①国土地理院DEM z14タイル(cyberjapandata/maps.gsi.go.jp・Referer付き)
#              → ②国土地理院DEM10m(OpenTopoData gsi10m経由) → ③Copernicus DEM90m(open-meteo)
# 検証ゲート: 東京駅(2-12m)/高尾山頂(560-640m)を通ったソースのみ使用(推測なし・失敗は中断)。
import json, os, glob, math, datetime, sys, time, io, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

BASE = '/home/user/workspace/flex-railway-map'
OUTDIR = '/home/user/workspace/flex-rail-map-project/data/kanto-line-geometry-2026-10'

GSI_META_BASE = {
    'tiles': {'sourceName': '国土地理院 (GSI) 標高タイル(DEM z14・10m級)',
              'sourceUrl': 'https://maps.gsi.go.jp/development/ichiran.html#dem',
              'license': '国土地理院利用規約(出典表示)に従う'},
    'otd': {'sourceName': '国土地理院 DEM10m (OpenTopoData gsi10m 経由)',
            'sourceUrl': 'https://www.opentopodata.org/',
            'license': '国土地理院利用規約(出典表示)に従う・取得経路: OpenTopoData API'},
    'om': {'sourceName': 'Copernicus DEM GLO-90m (Open-Meteo Elevation API 経由)',
           'sourceUrl': 'https://open-meteo.com/en/docs/elevation-api',
           'license': 'Copernicus DEM / Open-Meteo 利用規約に従う',
           'accuracyNote': '90m解像度のためGSI 10mより粗い。GSI取得可能になったら再取得推奨'}
}

def hav(la1, lo1, la2, lo2):
    R = 6371000; p = math.pi / 180
    a = math.sin((la2 - la1) * p / 2) ** 2 + math.cos(la1 * p) * math.cos(la2 * p) * math.sin((lo2 - lo1) * p / 2) ** 2
    return 2 * R * math.asin(a ** 0.5)

def http_get(url, timeout=20):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'https://maps.gsi.go.jp/'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

class GsiTiles:
    def __init__(self, z, layer):
        self.z = z; self.layer = layer
        self.cache = {}
        self.DEM = os.path.join(BASE, 'dem_cache', f'z{z}')
        os.makedirs(self.DEM, exist_ok=True)

    def tile_xy(self, lat, lon):
        n = 2 ** self.z
        return int((lon + 180) / 360 * n), int((math.degrees(math.atan2(math.sinh(math.radians(lat)), math.cos(math.radians(lat)))) + 90) / 180 * n)

    def tile_path(self, x, y):
        return os.path.join(self.DEM, f'{self.layer}_{x}_{y}.png')

    def fetch_tile(self, x, y):
        p = self.tile_path(x, y)
        if os.path.exists(p):
            return p
        url = f'https://cyberjapandata.gsi.go.jp/xyz/{self.layer}/{self.z}/{x}/{y}.png'
        for host in ('https://cyberjapandata.gsi.go.jp', 'https://maps.gsi.go.jp'):
            url2 = url.replace('https://cyberjapandata.gsi.go.jp', host)
            for _ in range(2):
                try:
                    data = http_get(url2, 15)
                    if len(data) > 100:
                        open(p, 'wb').write(data)
                        return p
                except Exception:
                    pass
        return None

    def decode(self, img, lat, lon):
        fx = (lon + 180) / 360 * (2 ** self.z) * 256
        fy = (math.degrees(math.atan2(math.sinh(math.radians(lat)), math.cos(math.radians(lat)))) + 90) / 180 * (2 ** self.z) * 256
        px = min(max(int(fx % 256), 0), 255); py = min(max(int(fy % 256), 0), 255)
        r, g, b = img.getpixel((px, py))[:3]
        v = (r * 65536 + g * 256 + b) * 0.01 - 10000
        return round(v, 1) if -100 < v < 4500 else None

    def prefetch(self, points):
        todo = [p for p in points if p not in self.cache]
        if not todo:
            return
        tiles = {}
        for p in todo:
            tiles.setdefault(self.tile_xy(*p), []).append(p)
        keys = list(tiles.keys())
        with ThreadPoolExecutor(8) as ex:
            got = list(ex.map(lambda k: (k, self.fetch_tile(*k)), keys))
        for (x, y), pts in tiles.items():
            pth = self.tile_path(x, y)
            vals = None
            if os.path.exists(pth):
                try:
                    img = Image.open(pth).convert('RGB')
                    vals = [self.decode(img, *pt) for pt in pts]
                except Exception:
                    vals = None
            if vals is None:
                vals = [None] * len(pts)
            for pt, v in zip(pts, vals):
                self.cache[pt] = v

    def at(self, lat, lon):
        return self.cache.get((lat, lon))

class BatchApi:
    """OpenTopoData / Open-Meteo 共通のバッチ取得(逐次・sleep付き)"""
    def __init__(self, kind):
        self.kind = kind
        self.cache = {}
        self.cachef = os.path.join(BASE, 'dem_cache', f'api_cache_{kind}.json')
        os.makedirs(os.path.join(BASE, 'dem_cache'), exist_ok=True)
        if os.path.exists(self.cachef):
            try:
                self.cache = {tuple(k.split(',')): v for k, v in json.load(open(self.cachef)).items()}
            except Exception:
                self.cache = {}

    def _save(self):
        try:
            json.dump({','.join(k): v for k, v in self.cache.items()}, open(self.cachef, 'w'))
        except Exception:
            pass

    def _one(self, coords):
        if self.kind == 'otd':
            locs = '|'.join(f'{la:.6f},{lo:.6f}' for la, lo in coords)
            url = f'https://api.opentopodata.org/v1/gsi10m?locations={locs}'
            try:
                d = json.loads(http_get(url, 25))
                if d.get('status') != 'OK':
                    return None
                return [r['elevation'] if r.get('elevation') is not None else None for r in d['results']]
            except Exception:
                return None
        else:
            las = ','.join(f'{la:.6f}' for la, lo in coords)
            los = ','.join(f'{lo:.6f}' for la, lo in coords)
            url = f'https://api.open-meteo.com/v1/elevation?latitude={las}&longitude={los}'
            try:
                d = json.loads(http_get(url, 25))
                return d.get('elevation')
            except Exception:
                return None

    def prefetch(self, points):
        todo = [p for p in points if p not in self.cache]
        if not todo:
            return
        CH = 100 if self.kind != 'om' else 100
        for i in range(0, len(todo), CH):
            chunk = todo[i:i + CH]
            for attempt in range(2):
                vals = self._one(chunk)
                if vals is not None and len(vals) == len(chunk):
                    break
                time.sleep(3)
                vals = None
            if vals is None:
                vals = [None] * len(chunk)
            for pt, v in zip(chunk, vals):
                self.cache[pt] = round(v, 1) if v is not None else None
            self._save()
            time.sleep(1.1 if self.kind == 'otd' else 0.2)

    def at(self, lat, lon):
        return self.cache.get((lat, lon))

def probe_gsi():
    checks = [(35.6812, 139.7671, (2, 12)), (35.6251, 139.2436, (560, 640))]
    for z in (14, 13, 12):
        for layer in ('dem', 'dem_png'):
            g = GsiTiles(z, layer)
            g.prefetch([(a, b) for a, b, _ in checks])
            ok = all(g.at(a, b) is not None and r0 <= g.at(a, b) <= r1 for a, b, (r0, r1) in checks)
            vals = [g.at(a, b) for a, b, _ in checks]
            print(f'GSI z={z} {layer}: pass={ok} vals={vals}')
            if ok:
                return g
    return None

def probe_otd():
    checks = [(35.6812, 139.7671, (2, 12)), (35.6251, 139.2436, (560, 640))]
    b = BatchApi('otd')
    b.prefetch([(a, b2) for a, b2, _ in checks])
    ok = all(b.at(a, b2) is not None and r0 <= b.at(a, b2) <= r1 for a, b2, (r0, r1) in checks)
    vals = [b.at(a, b2) for a, b2, _ in checks]
    print(f'OpenTopoData gsi10m: pass={ok} vals={vals}')
    return b if ok else None

def probe_om():
    checks = [(35.6812, 139.7671, (2, 12)), (35.6251, 139.2436, (560, 640))]
    b = BatchApi('om')
    b.prefetch([(a, b2) for a, b2, _ in checks])
    ok = all(b.at(a, b2) is not None and r0 <= b.at(a, b2) <= r1 for a, b2, (r0, r1) in checks)
    vals = [b.at(a, b2) for a, b2, _ in checks]
    print(f'Open-Meteo cop90: pass={ok} vals={vals}')
    return b if ok else None

def pick_source():
    g = probe_gsi()
    if g:
        return g, GSI_META_BASE['tiles']
    b = probe_otd()
    if b:
        return b, GSI_META_BASE['otd']
    b = probe_om()
    if b:
        return b, GSI_META_BASE['om']
    return None, None

def sample_indices(n, step):
    idx = list(range(0, n, step))
    if (n - 1) not in idx:
        idx.append(n - 1)
    return idx

def main():
    src = [f for f in sorted(glob.glob(os.path.join(OUTDIR, 'kanto-lines_2*.json'))) if '-3d' not in f]
    if not src:
        print('NO_SOURCE'); sys.exit(1)
    d = json.load(open(src[-1]))
    master = json.load(open(os.path.join(BASE, 'stations_kanto_master.json')))
    E, meta = pick_source()
    if E is None:
        print('ALL_ELEVATION_SOURCES_FAILED - 中断(推測値は入れない)')
        sys.exit(1)
    # サンプル総数からステップを動的決定(API課金/レート対策・目標<=45k点)
    total_v = sum(len(c) for l in d['lines'] for c in l['paths'])
    step = max(8, math.ceil(total_v / 36000))
    allpts = set()
    for line in d['lines']:
        for c in line['paths']:
            for i in sample_indices(len(c), step):
                allpts.add((c[i][0], c[i][1]))
    for s in master['stations']:
        allpts.add((s['lat'], s['lon']))
    print(f'SOURCE={meta["sourceName"]} vertices={total_v} step={step} unique_samples={len(allpts)}')
    if isinstance(E, GsiTiles):
        E.prefetch(list(allpts))
    else:
        E.prefetch(list(allpts))
    tile_fail = 0
    for li, line in enumerate(d['lines']):
        newpaths = []
        for c in line['paths']:
            si = sample_indices(len(c), step)
            ele = {i: E.at(c[i][0], c[i][1]) for i in si}
            n = len(c)
            out = []
            for i, (la, lo) in enumerate(c):
                if i in ele:
                    out.append([la, lo, ele[i]])
                    continue
                prev = next((j for j in range(i - 1, -1, -1) if j in ele), None)
                nxt = next((j for j in range(i + 1, n) if j in ele), None)
                v = None
                if prev is not None and nxt is not None and ele[prev] is not None and ele[nxt] is not None:
                    d1, d2 = hav(c[prev][0], c[prev][1], la, lo), hav(la, lo, c[nxt][0], c[nxt][1])
                    w = d1 / (d1 + d2) if (d1 + d2) > 0 else 0
                    v = round(ele[prev] * (1 - w) + ele[nxt] * w, 1)
                out.append([la, lo, v])
            tile_fail += sum(1 for x in out if x[2] is None)
            newpaths.append(out)
        line['paths3d'] = newpaths
        del line['paths']
        if li % 50 == 0:
            print(f'... {li}/{d["lineCount"]} lines')
    strows, sfail = [], 0
    for s in master['stations']:
        v = E.at(s['lat'], s['lon'])
        if v is None:
            sfail += 1
        strows.append({'name': s['name'], 'lat': s['lat'], 'lon': s['lon'],
                       'elevation_m': v,
                       'nullReason': None if v is not None else '標高ソース取得不可/無効値'})
    ts = datetime.datetime.now().strftime('%Y%m%d_%H%M')
    full_meta = {**meta, 'retrievedAt': '2026-10-11',
                 'definition': '標高は実測DEM値。頂点=実測、中間点=隣接サンプル間の線形補間(derived・方法明示)。取得不能点=null(推測なし)'}
    d['meta']['elevationSource'] = full_meta
    d['meta']['elevationNullVertices'] = tile_fail
    json.dump(d, open(os.path.join(OUTDIR, f'kanto-lines-3d_{ts}.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    se = {'meta': {'generatedAt': datetime.datetime.now().isoformat(), **full_meta},
          'stationCount': len(strows), 'nullCount': sfail, 'stations': strows}
    json.dump(se, open(os.path.join(OUTDIR, f'stations-elevation_{ts}.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    total_v3 = sum(len(c) for l in d['lines'] for c in l['paths3d'])
    print(f'ELEV_DONE lines={d["lineCount"]} vertices={total_v3} null_vertices={tile_fail} stations={len(strows)} null_stations={sfail} out3d=kanto-lines-3d_{ts}.json')

if __name__ == '__main__':
    main()
