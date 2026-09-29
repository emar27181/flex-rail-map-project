#!/usr/bin/env python3
# poi_kanto_full.json(グリッド収集の逐次保存結果)を
# flex-rail-map-project リポジトリ形式(station-stats-data.json 互換)へ変換する。
# - fill: 既存エントリ駅に足りない800mフィールドのみ
# - new-stations: アプリ未登録駅
# - coverage.csv: マスタ全ユニーク駅の収集有無
# - merge-kanto800.py: 既存値を絶対に上書きしない冪等マージスクリプト
# - README.md: 出典・方法・マージ手順(現在の収集数を自動反映)
import json, csv, os, datetime

MASTER = '/home/user/workspace/flex-railway-map/stations_kanto_master.json'
APP = '/home/user/workspace/flex-rail-map-project/src/data/station-stats-data.json'
FULL = '/home/user/workspace/flex-railway-map/poi_kanto_full.json'
OUTDIR = '/home/user/workspace/flex-rail-map-project/data/kanto-poi-800m-2026-09'
F800 = ['fastFoodCount', 'mallCount', 'bankCount', 'postOfficeCount', 'pharmacyCount', 'nurseryCount',
        'schoolCount', 'universityCount', 'libraryCount', 'clinicCount', 'cinemaCount', 'gymCount',
        'hotelCount', 'attractionCount', 'parkCount']

master = json.load(open(MASTER))
app = json.load(open(APP))
res = json.load(open(FULL))

# 同一名称駅は代表点(最初のosmId)1件に集約
by_name = {}
for key, r in res.items():
    by_name.setdefault(r['stationName'], r)

fill, newst = {}, {}
for n, r in by_name.items():
    fields = {f: int(r[f]) for f in F800}
    if n in app:
        if not any(f in app[n] for f in F800):
            fill[n] = fields
    else:
        newst[n] = {'stationName': n, 'lat': r['lat'], 'lng': r['lon'], **fields}

os.makedirs(OUTDIR, exist_ok=True)
json.dump(fill, open(OUTDIR + '/station-stats-data.kanto800.fill.json', 'w'), ensure_ascii=False, indent=0)
json.dump(newst, open(OUTDIR + '/station-stats-data.kanto800.new-stations.json', 'w'), ensure_ascii=False, indent=0)

seen = set()
with open(OUTDIR + '/coverage.csv', 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f)
    w.writerow(['station_name', 'osmId', 'lat', 'lng', 'isJrEast', 'collected',
                'restaurantCount', 'cafeCount', 'parkCount'])
    for s in master['stations']:
        if s['name'] in seen:
            continue
        seen.add(s['name'])
        r = by_name.get(s['name'])
        op = s.get('operator') or ''
        w.writerow([s['name'], s['osmId'], s['lat'], s['lon'],
                    1 if ('東日本旅客' in op or 'JR東日本' in op) else 0,
                    1 if r else 0,
                    r['restaurantCount'] if r else '', r['cafeCount'] if r else '',
                    r['parkCount'] if r else ''])

open(OUTDIR + '/merge-kanto800.py', 'w', encoding='utf-8').write('''#!/usr/bin/env python3
# data/kanto-poi-800m-2026-09/station-stats-data.kanto800.fill.json を
# src/data/station-stats-data.json にマージする。既存フィールドは一切上書きしない。
# 使い方: リポジトリ直下で python3 data/kanto-poi-800m-2026-09/merge-kanto800.py
import json
FILL = 'data/kanto-poi-800m-2026-09/station-stats-data.kanto800.fill.json'
TARGET = 'src/data/station-stats-data.json'
fill = json.load(open(FILL, encoding='utf-8'))
target = json.load(open(TARGET, encoding='utf-8'))
applied = missing = unchanged = 0
for name, fields in fill.items():
    if name not in target:
        missing += 1
        continue
    ent = target[name]
    added = False
    for k, v in fields.items():
        if k not in ent:
            ent[k] = v
            added = True
    if added:
        applied += 1
    else:
        unchanged += 1
with open(TARGET, 'w', encoding='utf-8') as f:
    json.dump(target, f, ensure_ascii=False, separators=(',', ':'))
print(f'applied={applied} unchanged={unchanged} not_in_target={missing}')
''')

today = datetime.date.today().isoformat()
readme = f"""# kanto-poi-800m-2026-09 — 首都圏駅周辺POI(半径800m・OSM実測)

## これは何
`src/data/stationStats.ts` の `StationStats` のうち**PoC(2026-09-24)で新設された半径800m系フィールド**を、
PoCの10駅以外に拡張収集したもの。形式は `src/data/station-stats-data.json` と同じ
キー(駅名)・同じフィールド名の**マージ可能な断片**。

- 収集日: {today}
- 方法: OpenStreetMap / Overpass API(mirror: overpass.private.coffee)、駅代表点(OSM `railway=station` ノード)から**半径800m直線円**内をカテゴリ集計
- ライセンス: ODbL (c) OpenStreetMap contributors
- 対象フィールド(15種, `dataQuality: 'real'`): fastFoodCount / mallCount / bankCount / postOfficeCount / pharmacyCount / nurseryCount / schoolCount / universityCount / libraryCount / clinicCount / cinemaCount / gymCount / hotelCount / attractionCount / parkCount
- 推定値は一切含まない。収集できなかった駅はこのファイルに存在しない(グレー表示フォールバックは既存どおり)

## ファイル
| ファイル | 内容 |
|---|---|
| `station-stats-data.kanto800.fill.json` | **既存エントリあり**の駅に足りない800mフィールドだけを抽出(キー=駅名) |
| `station-stats-data.kanto800.new-stations.json` | アプリ未登録の駅(stationName/lat/lng + 800mフィールド)。登録判断はプロジェクト側で |
| `coverage.csv` | 首都圏マスタ全ユニーク駅の収集有無(collected=1が取得済み) |
| `merge-kanto800.py` | fill を `src/data/station-stats-data.json` にマージ(既存値は絶対に上書きしない・冪等) |

## マージ手順
```bash
python3 data/kanto-poi-800m-2026-09/merge-kanto800.py
# → applied=N unchanged=0 not_in_target=0 になれば反映完了
```

## 既存500m系フィールドについて(重要)
`restaurantCount` / `cafeCount` / `convenienceStoreCount` / `supermarketCount` / `hospitalCount` /
`izakayaCount` / `ramenCount` / `bookstoreCount` / `officeCount` / `coworkingCount` は
既存の**半径500m**データと同一名フィールドのため、**本データ(800m)では提供しない**。
(`stationStats.ts` の設計どおり: 半径が異なるデータで既存値を上書きしない)

## 収集状況
- マスタ(首都圏4県・OSM `railway=station` ノード): {len(master['stations'])}駅(ユニーク名 {len(seen)}駅)
- 収集完了(800m集計まで): {len(by_name)}駅
- 継続方法: 収集スクリプトは逐次保存のため再実行で続きから集計可能
  (スクリプト: `data/kanto-station-poc-2026-09/scripts/`、集計結果: `poi_kanto_full.json`)
"""
open(OUTDIR + '/README.md', 'w', encoding='utf-8').write(readme)

# ---- validation ----
for p, isnew in [('station-stats-data.kanto800.fill.json', False),
                 ('station-stats-data.kanto800.new-stations.json', True)]:
    d = json.load(open(OUTDIR + '/' + p))
    allowed = set(F800) | ({'stationName', 'lat', 'lng'} if isnew else set())
    for k, v in d.items():
        assert set(v.keys()) <= allowed, (p, k, set(v.keys()) - allowed)
        for fld in F800:
            if fld in v:
                assert isinstance(v[fld], int) and v[fld] >= 0, (p, k, fld, v[fld])
        if isnew:
            assert 'restaurantCount' not in v and 'cafeCount' not in v  # 500m系混入なし
print(f"VALIDATED: fill={len(fill)} new-stations={len(newst)} collected={len(by_name)}/{len(seen)}")
