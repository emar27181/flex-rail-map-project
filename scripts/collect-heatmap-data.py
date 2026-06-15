#!/usr/bin/env python3
"""
Overpass API で各駅500m圏内の施設数を実取得し station-stats-data.json を更新する。
対象: 首都圏主要路線 330駅
1駅1クエリ（一括取得）でAPIコール数を最小化。
"""

import json, time, urllib.request, urllib.parse, math, sys, os

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
R = 500
SLEEP_OK  = 4.0   # 成功時の待機秒
SLEEP_ERR = 30.0  # エラー時の待機秒
MAX_RETRY = 3

def fetch_all(lat: float, lng: float) -> list:
    q = f"""[out:json][timeout:30];
(
  node["shop"="convenience"](around:{R},{lat},{lng});
  way["shop"="convenience"](around:{R},{lat},{lng});
  node["amenity"="restaurant"](around:{R},{lat},{lng});
  way["amenity"="restaurant"](around:{R},{lat},{lng});
  node["amenity"="fast_food"](around:{R},{lat},{lng});
  way["amenity"="fast_food"](around:{R},{lat},{lng});
  node["amenity"="cafe"](around:{R},{lat},{lng});
  way["amenity"="cafe"](around:{R},{lat},{lng});
  node["shop"="supermarket"](around:{R},{lat},{lng});
  way["shop"="supermarket"](around:{R},{lat},{lng});
  node["amenity"="hospital"](around:{R},{lat},{lng});
  way["amenity"="hospital"](around:{R},{lat},{lng});
  node["amenity"="clinic"](around:{R},{lat},{lng});
  way["amenity"="clinic"](around:{R},{lat},{lng});
  node["amenity"="doctors"](around:{R},{lat},{lng});
  way["amenity"="doctors"](around:{R},{lat},{lng});
  way["leisure"="park"](around:{R},{lat},{lng});
  relation["leisure"="park"](around:{R},{lat},{lng});
);
out body geom;"""
    body = urllib.parse.urlencode({"data": q}).encode()
    req = urllib.request.Request(
        OVERPASS_URL, data=body,
        headers={"User-Agent": "flex-rail-map-stats/1.0 (educational)", "Accept": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=35) as r:
        return json.loads(r.read()).get("elements", [])

def count_tag(els, key, val):
    return sum(1 for e in els if e.get("tags", {}).get(key) == val)

def park_area(els):
    total = 0.0
    for el in els:
        if el.get("tags", {}).get("leisure") != "park":
            continue
        coords = el.get("geometry", [])
        if len(coords) < 3:
            continue
        area = 0.0
        n = len(coords)
        for i in range(n):
            j = (i + 1) % n
            xi = coords[i]["lon"] * 111320 * math.cos(math.radians(coords[i]["lat"]))
            yi = coords[i]["lat"] * 110540
            xj = coords[j]["lon"] * 111320 * math.cos(math.radians(coords[j]["lat"]))
            yj = coords[j]["lat"] * 110540
            area += xi * yj - xj * yi
        total += abs(area) / 2
    return round(total)

# ── 読み込み ──────────────────────────────────────────────────────
with open("/tmp/tokyo_stations.json") as f:
    stations = json.load(f)

data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../src/data/station-stats-data.json")
with open(data_path) as f:
    stats = json.load(f)

print(f"対象駅数: {len(stations)}  既存データ: {len(stats)}駅", flush=True)

# ── 収集 ──────────────────────────────────────────────────────────
for idx, st in enumerate(stations):
    name, lat, lng = st["name"], st["lat"], st["lng"]

    for attempt in range(MAX_RETRY):
        try:
            els = fetch_all(lat, lng)
            break
        except Exception as e:
            print(f"  [{attempt+1}/{MAX_RETRY}] {name} エラー: {e}", file=sys.stderr, flush=True)
            if attempt < MAX_RETRY - 1:
                time.sleep(SLEEP_ERR)
            else:
                els = None

    if els is None:
        print(f"[{idx+1}/{len(stations)}] {name}: スキップ（取得失敗）", flush=True)
        continue

    entry = stats.get(name, {"stationName": name, "lat": lat, "lng": lng})

    cv   = count_tag(els, "shop", "convenience")
    rest = count_tag(els, "amenity", "restaurant") + count_tag(els, "amenity", "fast_food")
    cafe = count_tag(els, "amenity", "cafe")
    sup  = count_tag(els, "shop", "supermarket")
    hosp = count_tag(els, "amenity", "hospital") + count_tag(els, "amenity", "clinic") + count_tag(els, "amenity", "doctors")
    park = park_area(els)

    entry["convenienceStoreCount"] = cv
    entry["restaurantCount"]       = rest
    entry["cafeCount"]             = cafe
    entry["supermarketCount"]      = sup
    entry["hospitalCount"]         = hosp
    entry["parkAreaM2"]            = park

    stats[name] = entry
    print(f"[{idx+1}/{len(stations)}] {name}: コンビニ={cv} 飲食={rest} カフェ={cafe} スーパー={sup} 病院={hosp} 公園={park}m²", flush=True)

    # 10駅ごとに中間保存
    if (idx + 1) % 10 == 0:
        with open(data_path, "w", encoding="utf-8") as f:
            json.dump(stats, f, ensure_ascii=False, separators=(",", ":"))
        print(f"  ✓ 中間保存済み ({idx+1}駅完了)", flush=True)

    time.sleep(SLEEP_OK)

# 最終保存
with open(data_path, "w", encoding="utf-8") as f:
    json.dump(stats, f, ensure_ascii=False, separators=(",", ":"))

print(f"\n完了: {len(stations)}駅の施設データを更新しました。")
