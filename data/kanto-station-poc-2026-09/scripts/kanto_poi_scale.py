#!/usr/bin/env python3
# 首都圏全駅(1,731駅) × 半径800m POI一括収集(グリッドキャッシュ方式)
# 方式: 0.045°グリッドのセル単位でOverpassからPOIを一括取得→キャッシュ→
#       セルが揃った駅から順に800m円内をローカル集計(type,id重複排除付き)
# 逐次保存で中断セーフ。--minutes でソフト時間予算を指定。
import json, os, gzip, time, math, subprocess, csv, sys

BASE = "/home/user/workspace/poi_cache"
CELLDIR = os.path.join(BASE, "cells")
MASTER = "/home/user/workspace/flex-railway-map/stations_kanto_master.json"
OUT_FULL = "/home/user/workspace/flex-railway-map/poi_kanto_full.json"
OUT_COV = "/home/user/workspace/flex-railway-map/poi_kanto_coverage.csv"
EP = "https://overpass.private.coffee/api/interpreter"
CELL = 0.045
_args = sys.argv[1:]
MINUTES = float(_args[_args.index('--minutes') + 1]) if '--minutes' in _args else 20.0
DEADLINE = time.time() + MINUTES * 60

AMEN = 'restaurant|fast_food|food_court|cafe|hospital|clinic|library|kindergarten|nursery|school|university|college|coworking_space|cinema|bank|pharmacy|post_office'
SHOP = 'books|convenience|supermarket|department_store|mall'
LEIS = 'park|garden|fitness_centre|sports_centre'
TOUR = 'hotel|guest_house|hostel|attraction|museum|gallery|zoo|aquarium|theme_park'

def classify(t):
    c = 0
    a = t.get('amenity'); s = t.get('shop'); l = t.get('leisure'); tu = t.get('tourism')
    if a == 'restaurant': c |= 1 << 0
    if a in ('fast_food', 'food_court'): c |= 1 << 1
    if a == 'cafe': c |= 1 << 2
    if s == 'convenience': c |= 1 << 3
    if s == 'supermarket': c |= 1 << 4
    if s == 'books': c |= 1 << 5
    if s in ('mall', 'department_store'): c |= 1 << 6
    if a == 'hospital': c |= 1 << 7
    if a == 'clinic': c |= 1 << 8
    if a == 'pharmacy': c |= 1 << 9
    if a == 'library': c |= 1 << 10
    if a in ('kindergarten', 'nursery'): c |= 1 << 11
    if a == 'school': c |= 1 << 12
    if a in ('university', 'college'): c |= 1 << 13
    if a == 'coworking_space' or t.get('office') == 'coworking': c |= 1 << 14
    if 'office' in t and t.get('office') != 'coworking': c |= 1 << 15
    if a == 'cinema': c |= 1 << 16
    if l in ('fitness_centre', 'sports_centre'): c |= 1 << 17
    if tu in ('hotel', 'hostel', 'guest_house'): c |= 1 << 18
    if tu in ('attraction', 'museum', 'gallery', 'zoo', 'aquarium', 'theme_park'): c |= 1 << 19
    if l in ('park', 'garden'): c |= 1 << 20
    if a == 'bank': c |= 1 << 21
    if a == 'post_office': c |= 1 << 22
    cu = t.get('cuisine', '')
    if 'izakaya' in cu: c |= 1 << 23
    if 'ramen' in cu: c |= 1 << 24
    return c

COUNT_KEYS = ['restaurantCount', 'fastFoodCount', 'cafeCount', 'convenienceStoreCount', 'supermarketCount',
              'bookstoreCount', 'mallCount', 'hospitalCount', 'clinicCount', 'pharmacyCount', 'libraryCount',
              'nurseryCount', 'schoolCount', 'universityCount', 'coworkingCount', 'officeCount', 'cinemaCount',
              'gymCount', 'hotelCount', 'attractionCount', 'parkCount', 'bankCount', 'postOfficeCount',
              'izakayaTaggedCount', 'ramenTaggedCount']

def hav2(la1, lo1, la2, lo2):
    R = 6371000; p = math.pi / 180
    a = math.sin((la2 - la1) * p / 2) ** 2 + math.cos(la1 * p) * math.cos(la2 * p) * math.sin((lo2 - lo1) * p / 2) ** 2
    return 2 * R * math.asin(a ** 0.5)

def cellpath(ck):
    return os.path.join(CELLDIR, f"c_{ck[0]}_{ck[1]}.json.gz")

def cellbbox(ck):
    la0 = round(ck[1] * CELL, 6); lo0 = round(ck[0] * CELL, 6)
    return f"{la0},{lo0},{round(la0 + CELL, 6)},{round(lo0 + CELL, 6)}"

def fetch_cell(ck):
    bbox = cellbbox(ck)
    q = ('[out:json][timeout:100];('
         f'node["amenity"~"^{AMEN}$"]({bbox});way["amenity"~"^{AMEN}$"]({bbox});relation["amenity"~"^{AMEN}$"]({bbox});'
         f'node["shop"~"^{SHOP}$"]({bbox});way["shop"~"^{SHOP}$"]({bbox});relation["shop"~"^{SHOP}$"]({bbox});'
         f'node["leisure"~"^{LEIS}$"]({bbox});way["leisure"~"^{LEIS}$"]({bbox});relation["leisure"~"^{LEIS}$"]({bbox});'
         f'node["office"]({bbox});way["office"]({bbox});relation["office"]({bbox});'
         f'node["tourism"~"^{TOUR}$"]({bbox});way["tourism"~"^{TOUR}$"]({bbox});relation["tourism"~"^{TOUR}$"]({bbox});'
         f');out tags center;')
    for attempt in (1, 2):
        outf = os.path.join(BASE, 'cell_tmp.json')
        if os.path.exists(outf):
            os.remove(outf)
        try:
            subprocess.run(["curl", "-sS", "-m", "160", "-A", "Mozilla/5.0",
                            "--data-urlencode", "data=" + q, EP, "-o", outf],
                           capture_output=True, text=True, timeout=175)
        except subprocess.TimeoutExpired:
            time.sleep(5); continue
        try:
            d = json.load(open(outf))
            # Overpass はタイムアウト・メモリ超過でも elements=[] と remark を返す。
            # それを「0件」として保存すると、施設が無い駅に見えてしまう（CLAUDE.md のデータの絶対ルール）
            if 'elements' in d and 'error' not in str(d.get('remark', '')).lower():
                return d['elements']
        except Exception:
            pass
        time.sleep(5)
    return None

def save_cell(ck, elements):
    rows = []
    for el in elements:
        t = el.get('tags', {})
        c = classify(t)
        if c == 0:
            continue
        cc = el.get('center') or {'lat': el.get('lat'), 'lon': el.get('lon')}
        if not cc or not cc.get('lat'):
            continue
        typ = 'n' if el['type'] == 'node' else ('w' if el['type'] == 'way' else 'r')
        rows.append(json.dumps([typ, el['id'], round(cc['lat'], 7), round(cc['lon'], 7), c],
                               separators=(',', ':')))
    with gzip.open(cellpath(ck), 'wt') as f:
        f.write('\n'.join(rows))
    return len(rows)

def agg_station(lat, lon, cks):
    seen = set(); cnt = [0] * 25
    for ck in cks:
        with gzip.open(cellpath(ck), 'rt') as f:
            for line in f:
                if not line:
                    continue
                typ, eid, a, o, c = json.loads(line)
                key = (typ, eid)
                if key in seen:
                    continue
                if hav2(lat, lon, a, o) <= 800.5:
                    seen.add(key)
                    for b in range(25):
                        if c >> b & 1:
                            cnt[b] += 1
    return cnt

def is_jre(op, net):
    s = f"{op or ''} {net or ''}"
    return ("東日本旅客" in s or "JR東日本" in s or "jr east" in s.lower() or "jr-east" in s.lower())

os.makedirs(CELLDIR, exist_ok=True)
master = json.load(open(MASTER))

# 駅→必要セル(円bboxと交差する最大4セル)
stations = []
for s in master['stations']:
    iy0 = math.floor((s['lat'] - 0.0075) / CELL); iy1 = math.floor((s['lat'] + 0.0075) / CELL)
    ix0 = math.floor((s['lon'] - 0.0090) / CELL); ix1 = math.floor((s['lon'] + 0.0090) / CELL)
    cks = [(ix, iy) for iy in range(iy0, iy1 + 1) for ix in range(ix0, ix1 + 1)]
    stations.append({'osmId': s['osmId'], 'name': s['name'], 'lat': s['lat'], 'lon': s['lon'],
                     'jre': is_jre(s.get('operator'), s.get('network')), 'cells': cks})

cell_st = {}
for st in stations:
    for ck in st['cells']:
        cell_st.setdefault(ck, []).append(st)

# キャッシュ済みセル
cached = {ck for ck in cell_st if os.path.exists(cellpath(ck))}
print(f"stations={len(stations)} cells_needed={len(cell_st)} already_cached={len(cached)}", flush=True)

results = {}
if os.path.exists(OUT_FULL):
    results = json.load(open(OUT_FULL))
    print(f"resuming with {len(results)} stations already aggregated", flush=True)

# 優先度: セルが固まっている(駅数が多い)順
queue = sorted(cell_st.keys(), key=lambda ck: -len(cell_st[ck]))
fetched = 0; failed = []
save_every = 20

for ck in queue:
    if time.time() > DEADLINE:
        print('deadline reached', flush=True)
        break
    if ck in cached:
        pass
    else:
        els = fetch_cell(ck)
        if els is None:
            failed.append(ck)
            print(f"cell {ck} FAILED", flush=True)
            time.sleep(3)
            continue
        n = save_cell(ck, els)
        fetched += 1
        print(f"cell {ck} ok elements={n} stations_serving={len(cell_st[ck])} [{fetched} fetched]", flush=True)
        time.sleep(2)
    cached.add(ck)
    # このセルを必要とする駅で、セルが揃ったものを集計
    for st in cell_st[ck]:
        if st['name'] + '|' + str(st['osmId']) in results:
            continue
        if all(c in cached for c in st['cells']):
            cnt = agg_station(st['lat'], st['lon'], st['cells'])
            rec = {k: cnt[i] for i, k in enumerate(COUNT_KEYS)}
            results[st['name'] + '|' + str(st['osmId'])] = {
                'stationName': st['name'], 'osmId': st['osmId'], 'lat': st['lat'], 'lon': st['lon'],
                'isJrEast': int(st['jre']), **rec}
            if len(results) % save_every == 0:
                json.dump(results, open(OUT_FULL, 'w'), ensure_ascii=False)

json.dump(results, open(OUT_FULL, 'w'), ensure_ascii=False)

# coverage CSV
with open(OUT_COV, 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.writer(f)
    w.writerow(['osmId', 'name', 'lat', 'lon', 'isJrEast', 'status', 'cellsDone', 'cellsTotal',
                'restaurantCount', 'cafeCount', 'convenienceStoreCount', 'parkCount'])
    for st in stations:
        key = st['name'] + '|' + str(st['osmId'])
        done = key in results
        cd = sum(1 for c in st['cells'] if c in cached)
        r = results.get(key, {})
        w.writerow([st['osmId'], st['name'], st['lat'], st['lon'], int(st['jre']),
                    'done' if done else 'pending', cd, len(st['cells']),
                    r.get('restaurantCount', ''), r.get('cafeCount', ''),
                    r.get('convenienceStoreCount', ''), r.get('parkCount', '')])

print(f"SUMMARY aggregated={len(results)}/{len(stations)} cells_cached={len(cached)}/{len(cell_st)} "
      f"fetched_this_run={fetched} failed={len(failed)}", flush=True)
