"""
立体（標高）表示の「地面」に使う標高の格子を作る。

    python -m venv .venv-dem && .venv-dem/bin/pip install tifffile imagecodecs numpy
    .venv-dem/bin/python -I scripts/line-geometry/terrain_ground_build.py --cache <作業用フォルダ>

- 出典は線形の標高と同じ Copernicus DEM GLO-90（AWS Open Data の COG 版, copernicus-dem-90m）。
  同じ DEM なので、線形の高さと地面の高さの基準（EGM2008）がそろう
- 1度×1度のタイル（1200×1200, 3秒角≒90m）を、STEP_DEG ごとの格子の**平均**に縮める（間引きではなく平均）
- 水域は同じタイルに付いている水域マスク（WBM: 1=海, 2=湖, 3=川）から、格子の半分以上が水のときだけ水にする
- 範囲は関東全域（REGION）。立体表示の線形（v1 / v2）がはみ出すときは、その範囲＋PAD_DEG まで広げる
- 取得できなかったタイルは止める（0 や推測で埋めない）。ただし公式のタイル一覧（tileList.txt）に無いタイルは
  陸を含まない海だけの区画（Copernicus は海だけの区画のタイルを作らない）なので、海（高さ0）として扱う

書き出すもの:
  public/data/terrain3d-ground.json  … 格子の位置・大きさ・出典
  public/data/terrain3d-ground.bin   … 標高 Int16（m, リトルエンディアン, 北の行から・西の列から）の後に水域 Uint8
"""
import argparse
import datetime
import json
import math
import os
import sys
import urllib.request

import numpy as np
import tifffile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
LINES = os.path.join(ROOT, 'public', 'data', 'terrain3d-lines.json')
LINES_V2 = os.path.join(ROOT, 'public', 'data', 'terrain3d-lines-v2.json')
OUT_META = os.path.join(ROOT, 'public', 'data', 'terrain3d-ground.json')
OUT_BIN = os.path.join(ROOT, 'public', 'data', 'terrain3d-ground.bin')

BUCKET = 'https://copernicus-dem-90m.s3.amazonaws.com'
# 格子の間隔（度）。0.005度 ≒ 南北 550m・東西 450m。元の 6×6 画素の平均
STEP_DEG = 0.005
# 線形の範囲の外に足す幅（度）
PAD_DEG = 0.05
# 地面は路線の周りだけでなく関東全域を覆う（立体表示で範囲を決めずに見て回れるように, 2026-10-14）。
# 関東1都6県（伊豆諸島・小笠原を除く）がおおむね入る範囲。線形がはみ出すときは線形の範囲まで広げる
REGION = {'s': 34.85, 'n': 37.2, 'w': 138.35, 'e': 140.95}
# 1タイルの画素数（北緯50度まではどのタイルも 1200×1200）
TILE_PX = 1200
WATER_CLASSES = {1: 'ocean', 2: 'lake', 3: 'river'}


def tile_name(lat: int, lng: int) -> str:
    ns = 'N' if lat >= 0 else 'S'
    ew = 'E' if lng >= 0 else 'W'
    return f'Copernicus_DSM_COG_30_{ns}{abs(lat):02d}_00_{ew}{abs(lng):03d}_00_DEM'


def fetch(url: str, path: str) -> str:
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with urllib.request.urlopen(url, timeout=120) as r, open(path + '.part', 'wb') as f:
            f.write(r.read())
        os.replace(path + '.part', path)
    return path


def official_tiles(cache: str) -> set:
    path = fetch(f'{BUCKET}/tileList.txt', os.path.join(cache, 'tileList.txt'))
    return {line.strip() for line in open(path, encoding='utf-8') if line.strip()}


def read_tile(cache: str, lat: int, lng: int, listed: set):
    name = tile_name(lat, lng)
    if name not in listed:
        # 陸の無い区画（海だけ）。高さ0・水域=海
        return np.zeros((TILE_PX, TILE_PX)), np.ones((TILE_PX, TILE_PX), dtype=np.uint8)
    dem = fetch(f'{BUCKET}/{name}/{name}.tif', os.path.join(cache, f'{name}.tif'))
    wbm_name = name.replace('_DEM', '_WBM')
    wbm = fetch(f'{BUCKET}/{name}/AUXFILES/{wbm_name}.tif', os.path.join(cache, f'{wbm_name}.tif'))
    with tifffile.TiffFile(dem) as t:
        page = t.pages[0]
        tie = page.tags['ModelTiepointTag'].value
        scale = page.tags['ModelPixelScaleTag'].value
        z = page.asarray().astype(np.float64)
    w = tifffile.imread(wbm).astype(np.uint8)
    if z.shape != (TILE_PX, TILE_PX) or w.shape != z.shape:
        sys.exit(f'{name}: 想定外の大きさ {z.shape} / {w.shape}')
    # 左上の画素の左上の角が (lat+1, lng) であること（画素の範囲で切りそろえる前提）
    if abs(tie[3] - lng) > 1e-6 or abs(tie[4] - (lat + 1)) > 1e-6 or abs(scale[0] - 1 / TILE_PX) > 1e-9:
        sys.exit(f'{name}: 想定外の位置 tie={tie} scale={scale}')
    return z, w


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', required=True, help='DEM タイルを保存するフォルダ（リポジトリの外）')
    args = ap.parse_args()

    v1 = json.load(open(LINES, encoding='utf-8'))
    v2 = json.load(open(LINES_V2, encoding='utf-8'))
    pts = [p for r in v1['routes'] for path in r['paths'] for p in path]
    pts += [p for r in v2['routes'] for run in r['runs'] for p in run['p']]
    lats = [p[0] for p in pts]
    lngs = [p[1] for p in pts]
    s = math.floor(min(min(lats) - PAD_DEG, REGION['s']) / STEP_DEG) * STEP_DEG
    n = math.ceil(max(max(lats) + PAD_DEG, REGION['n']) / STEP_DEG) * STEP_DEG
    w = math.floor(min(min(lngs) - PAD_DEG, REGION['w']) / STEP_DEG) * STEP_DEG
    e = math.ceil(max(max(lngs) + PAD_DEG, REGION['e']) / STEP_DEG) * STEP_DEG

    # 必要なタイルをつないだ1枚の画像（北が上）
    lat_tiles = list(range(math.floor(s), math.ceil(n)))
    lng_tiles = list(range(math.floor(w), math.ceil(e)))
    H, W = TILE_PX * len(lat_tiles), TILE_PX * len(lng_tiles)
    z = np.empty((H, W)); water = np.empty((H, W), dtype=np.uint8)
    listed = official_tiles(args.cache)
    for i, lat in enumerate(reversed(lat_tiles)):
        for j, lng in enumerate(lng_tiles):
            tz, tw = read_tile(args.cache, lat, lng, listed)
            z[i * TILE_PX:(i + 1) * TILE_PX, j * TILE_PX:(j + 1) * TILE_PX] = tz
            water[i * TILE_PX:(i + 1) * TILE_PX, j * TILE_PX:(j + 1) * TILE_PX] = tw
    if not np.isfinite(z).all() or (z < -1000).any():
        sys.exit('標高に欠損（NaN / 負の大きな値）がある')

    top = max(lat_tiles) + 1; left = min(lng_tiles)
    px = round(STEP_DEG * TILE_PX)  # 1つの格子に入る画素（縦横）
    r0 = round((top - n) * TILE_PX); c0 = round((w - left) * TILE_PX)
    rows = round((n - s) / STEP_DEG); cols = round((e - w) / STEP_DEG)
    zc = z[r0:r0 + rows * px, c0:c0 + cols * px].reshape(rows, px, cols, px)
    wc = water[r0:r0 + rows * px, c0:c0 + cols * px].reshape(rows, px, cols, px)
    elev = np.rint(zc.mean(axis=(1, 3))).astype('<i2')

    water_cls = np.zeros((rows, cols), dtype=np.uint8)
    counts = np.stack([(wc == k).sum(axis=(1, 3)) for k in WATER_CLASSES], axis=-1)  # 海・湖・川の画素数
    is_water = counts.sum(axis=-1) * 2 >= px * px
    water_cls[is_water] = (np.argmax(counts, axis=-1) + 1)[is_water].astype(np.uint8)

    with open(OUT_BIN, 'wb') as f:
        f.write(elev.tobytes()); f.write(water_cls.tobytes())
    meta = {
        'latMax': round(n, 6), 'lngMin': round(w, 6), 'stepDeg': STEP_DEG, 'rows': rows, 'cols': cols,
        'layout': 'Int16 標高(m, little endian) rows×cols（北の行から・西の列から）→ Uint8 水域 rows×cols（0=陸, 1=海, 2=湖, 3=川）',
        'aggregation': f'元の {px}×{px} 画素（3秒角）の平均。水域は半分以上が水のときだけ',
        'heightMeaning': 'terrain',
        'heightReference': 'Copernicus DEM GLO-90（EGM2008 ジオイド基準の標高, m）。建物・樹木を含む表面（DSM）',
        'source': {
            'sourceName': 'Copernicus DEM GLO-90',
            'sourceUrl': 'https://registry.opendata.aws/copernicus-dem/',
            'license': '© DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved',
            'retrievedAt': datetime.date.today().isoformat(),
            'tiles': [tile_name(la, ln) for la in lat_tiles for ln in lng_tiles if tile_name(la, ln) in listed],
            'seaOnlyTiles': [tile_name(la, ln) for la in lat_tiles for ln in lng_tiles if tile_name(la, ln) not in listed],
        },
        'stats': {
            'minM': int(elev.min()), 'maxM': int(elev.max()),
            'waterCells': {name: int((water_cls == k).sum()) for k, name in WATER_CLASSES.items()},
        },
    }
    json.dump(meta, open(OUT_META, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(OUT_META, 'a').write('\n')
    print(f'{rows}x{cols} min={elev.min()} max={elev.max()} water={meta["stats"]["waterCells"]} → {OUT_BIN}')


if __name__ == '__main__':
    main()
