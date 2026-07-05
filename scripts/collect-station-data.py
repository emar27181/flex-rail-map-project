#!/usr/bin/env python3
"""
東京駅別統計データ収集スクリプト
============================================================
戦略: 一括DL → 駅へのSpatial Join（1駅1クエリではなく全件取得後に集計）

収集対象:
  1. Overpass API  - 施設系（居酒屋/ラーメン/書店/コワーキング）
  2. e-stat CSV    - 人口密度（国勢調査 小地域）
  3. MLIT CSVs     - 乗降客数（国土数値情報 N05）
  4. MLIT CSVs     - 不動産賃料（取引価格情報 手動DL必要）

使い方:
  # Step1: Overpass施設データを収集
  python3 collect-station-data.py overpass

  # Step2: 人口密度を収集（e-stat）
  python3 collect-station-data.py population

  # Step3: 乗降客数（MLIT国土数値情報ZIPをDLしてから）
  python3 collect-station-data.py passengers --zip ./N05-22.zip

  # 全ステップを順番に実行
  python3 collect-station-data.py all

出力: ./output/collected_YYYYMMDD.json  →  station-stats-data.json にマージ

必要ライブラリ:
  pip install requests   # Overpassリクエスト用
"""

import sys, json, os, re, math, time, glob, argparse
from datetime import date
from pathlib import Path

try:
    import requests
except ImportError:
    import urllib.request, urllib.parse
    requests = None

# ─── パス設定 ────────────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).parent
PROJECT_DIR  = SCRIPT_DIR.parent
DATA_DIR     = PROJECT_DIR / "src" / "data"
OUTPUT_DIR   = SCRIPT_DIR / "output"
STATS_JSON   = DATA_DIR / "station-stats-data.json"
OUTPUT_DIR.mkdir(exist_ok=True)

# Overpass エンドポイント（複数用意、失敗したら次を試す）
OVERPASS_ENDPOINTS = [
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]

# 東京広域バウンディングボックス（南,西,北,東）
TOKYO_BBOX = "33.0,138.0,36.5,141.2"

RADIUS_M = 500  # 駅からの半径


# ═══════════════════════════════════════════════════════════════════
# 1. 駅座標の抽出（TypeScriptソースから）
# ═══════════════════════════════════════════════════════════════════

def extract_stations_from_ts() -> dict:
    """
    src/data/*.ts の Station 定義から全駅の座標を抽出。
    station-stats-data.json は lat/lng が小数1桁に丸められているため使わない。
    """
    stations = {}
    pattern = re.compile(
        r"""[{,]\s*name:\s*['"]([^'"]+)['"]\s*,\s*lat:\s*([\d.]+)\s*,\s*lng:\s*([\d.]+)"""
    )
    skip = {"routes.ts", "stationStats.ts", "timetableData.ts"}
    for fpath in sorted(DATA_DIR.glob("*.ts")):
        if fpath.name in skip or "timetable" in fpath.name:
            continue
        text = fpath.read_text(encoding="utf-8")
        for m in pattern.finditer(text):
            name = m.group(1)
            lat, lng = float(m.group(2)), float(m.group(3))
            # 座標の精度チェック（1桁丸めは除外）
            if lat > 30 and lng > 130 and (lat != round(lat, 1) or lng != round(lng, 1)):
                if name not in stations:
                    stations[name] = {"lat": lat, "lng": lng}

    print(f"[stations] TypeScriptから {len(stations)} 駅を抽出", flush=True)
    return stations


# ═══════════════════════════════════════════════════════════════════
# 2. 空間距離ユーティリティ
# ═══════════════════════════════════════════════════════════════════

def haversine_m(lat1, lng1, lat2, lng2) -> float:
    """2点間の距離（メートル）"""
    R = 6371000.0
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (math.sin(d_lat / 2) ** 2
         + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2))
         * math.sin(d_lng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def build_grid(stations: dict, cell_deg=0.05) -> dict:
    """
    駅をグリッドに振り分けてSpatial Joinを高速化。
    cell_deg≈5km、RADIUS_M=500mなら隣接1セルのみ確認すればOK。
    """
    grid = {}
    for name, st in stations.items():
        gx = int(st["lat"] / cell_deg)
        gy = int(st["lng"] / cell_deg)
        grid.setdefault((gx, gy), []).append(name)
    return grid


def find_stations_within(lat, lng, stations, grid, radius=RADIUS_M, cell_deg=0.05):
    """施設(lat,lng)から radius m 以内の駅名リストを返す"""
    gx = int(lat / cell_deg)
    gy = int(lng / cell_deg)
    result = []
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            for name in grid.get((gx + dx, gy + dy), []):
                st = stations[name]
                if haversine_m(lat, lng, st["lat"], st["lng"]) <= radius:
                    result.append(name)
    return result


# ═══════════════════════════════════════════════════════════════════
# 3. Overpass 一括収集
# ═══════════════════════════════════════════════════════════════════

OVERPASS_FACILITY_QUERIES = {
    # key: (label, overpass_filter)
    "izakayaCount": ("居酒屋・バー", '[amenity~"^(bar|pub)$"]'),
    "ramenCount":   ("ラーメン屋",   '[amenity="restaurant"][cuisine~"ramen|ラーメン",i]'),
    "bookstoreCount": ("書店",       '[shop="books"]'),
    "coworkingCount": ("コワーキング", '[amenity="coworking_space"]'),
    # coworking_office も追加
    "coworkingCount2": ("コワーキング(office)", '[office="coworking"]'),
}

def overpass_post(query: str) -> list:
    """Overpass QL クエリを実行し elements を返す"""
    body = f"data={urllib.parse.quote(query)}" if requests is None else None

    for endpoint in OVERPASS_ENDPOINTS:
        try:
            if requests:
                r = requests.post(endpoint, data={"data": query}, timeout=120,
                                  headers={"User-Agent": "flex-rail-map-stats/2.0 (educational)"})
                if r.status_code == 200:
                    return r.json().get("elements", [])
                print(f"  {endpoint}: HTTP {r.status_code}", flush=True)
            else:
                import urllib.parse as up
                encoded = up.urlencode({"data": query}).encode()
                req = __import__("urllib.request").request.Request(
                    endpoint, data=encoded,
                    headers={"User-Agent": "flex-rail-map-stats/2.0 (educational)",
                             "Content-Type": "application/x-www-form-urlencoded"}
                )
                with __import__("urllib.request").request.urlopen(req, timeout=120) as resp:
                    return json.loads(resp.read()).get("elements", [])
        except Exception as e:
            print(f"  {endpoint}: {e}", flush=True)
    raise RuntimeError("全Overpassエンドポイントが失敗")


def collect_overpass(stations: dict) -> dict:
    """
    施設タイプごとに東京全域を一括クエリ → 各駅500m圏内でカウント。
    """
    grid = build_grid(stations)
    counts = {name: {} for name in stations}

    # coworkingCount はbar/pub と分けてあとでマージ
    merge_targets = {"coworkingCount2": "coworkingCount"}

    for key, (label, filt) in OVERPASS_FACILITY_QUERIES.items():
        print(f"\n[overpass] {label} ({key}) をクエリ中...", flush=True)

        q = f"""[out:json][timeout:180];
(
  node{filt}({TOKYO_BBOX});
  way{filt}({TOKYO_BBOX});
);
out center;"""
        try:
            elements = overpass_post(q)
        except RuntimeError as e:
            print(f"  スキップ: {e}", flush=True)
            continue

        print(f"  取得要素数: {len(elements)}", flush=True)

        # 各施設を駅に割り当て
        assigned = 0
        for el in elements:
            lat = el.get("lat") or (el.get("center") or {}).get("lat")
            lng = el.get("lon") or (el.get("center") or {}).get("lon")
            if lat is None or lng is None:
                continue
            for name in find_stations_within(lat, lng, stations, grid):
                dest_key = merge_targets.get(key, key)
                counts[name][dest_key] = counts[name].get(dest_key, 0) + 1
                assigned += 1

        print(f"  駅割り当て数: {assigned}", flush=True)
        time.sleep(3)  # レート制限

    return counts


# ═══════════════════════════════════════════════════════════════════
# 4. 人口密度収集（e-stat 国勢調査 小地域）
# ═══════════════════════════════════════════════════════════════════

def collect_population(stations: dict) -> dict:
    """
    e-stat から国勢調査の人口データを取得。
    ※ e-statのAPIキー不要のCSVダウンロードURLを使用:
    https://www.e-stat.go.jp/stat-search/files?page=1&toukei=00200521&tstat=000001049104

    現実的な方法:
      1. 上記URLから「小地域（町丁・字等）別 人口密度」CSVを手動DL
      2. このスクリプトに --population-csv ./population.csv で渡す

    または以下のAPIを使用（appId登録が必要、無料）:
      https://api.e-stat.go.jp/rest/3.0/app/json/getData?appId=YOUR_KEY&...

    → 現状はスケルトンのみ。CSVが手に入れば完成。
    """
    print("\n[population] e-stat CSVが必要 → --population-csv オプションで指定してください", flush=True)
    print("  DLリンク: https://www.e-stat.go.jp/gis/statmap-search?page=1&type=1&toukei=00200521", flush=True)
    return {}


def load_population_csv(csv_path: str, stations: dict) -> dict:
    """
    e-statからDLした小地域人口CSV（世界測地系座標付き）を読み込んで駅に割り当て。
    CSVフォーマット例: KEY_CODE,PREF,CITY,...,JINKO,SETAI,...,X_CODE,Y_CODE
    """
    import csv
    grid = build_grid(stations)
    counts = {name: {} for name in stations}

    with open(csv_path, encoding="cp932") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                lat = float(row.get("Y_CODE") or row.get("MOJI_Y") or 0)
                lng = float(row.get("X_CODE") or row.get("MOJI_X") or 0)
                pop = int(row.get("JINKO") or row.get("T001082001") or 0)
                area_ha = float(row.get("AREA") or 1)
                density = round(pop / (area_ha / 100), 1) if area_ha > 0 else 0  # 人/km²
            except (ValueError, KeyError):
                continue

            if lat < 30 or lng < 130:
                continue
            for name in find_stations_within(lat, lng, stations, grid):
                # 最近傍の区画の人口密度を使う
                if "populationDensity" not in counts[name]:
                    counts[name]["populationDensity"] = density
                else:
                    # 複数区画が重なる場合は最大値（最も都市的な環境）
                    counts[name]["populationDensity"] = max(
                        counts[name]["populationDensity"], density
                    )
    print(f"[population] {sum(1 for v in counts.values() if 'populationDensity' in v)} 駅に人口密度を割り当て", flush=True)
    return counts


# ═══════════════════════════════════════════════════════════════════
# 5. 乗降客数収集（国土数値情報 N05 鉄道）
# ═══════════════════════════════════════════════════════════════════

def collect_passengers_from_zip(zip_path: str, stations: dict) -> dict:
    """
    国土数値情報 N05（鉄道）のZIPファイルから乗降客数を取得。
    DL: https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N05.html
    ファイル名例: N05-22_GML.zip

    ZIPの中のCSV/GMLに駅名・乗降客数が含まれている。
    """
    import zipfile
    grid = build_grid(stations)
    counts = {}

    with zipfile.ZipFile(zip_path) as z:
        names = z.namelist()
        print(f"[passengers] ZIP内ファイル: {names[:10]}", flush=True)

        # N05-22_Station.csv を探す
        csv_files = [n for n in names if "Station" in n and n.endswith(".csv")]
        if not csv_files:
            print("[passengers] Station CSVが見つかりません。GMLを試します...", flush=True)
            return {}

        import csv, io
        with z.open(csv_files[0]) as cf:
            text = cf.read().decode("cp932", errors="replace")
            reader = csv.DictReader(io.StringIO(text))
            for row in reader:
                try:
                    station_name = row.get("N05_011") or row.get("駅名") or ""
                    passengers = int(row.get("N05_007") or row.get("乗降客数") or 0)
                    lat = float(row.get("N05_LAT") or row.get("緯度") or 0)
                    lng = float(row.get("N05_LON") or row.get("経度") or 0)
                except (ValueError, KeyError):
                    continue

                if passengers <= 0:
                    continue

                # 駅名で直接マッチング（座標より信頼性が高い）
                if station_name in stations:
                    counts[station_name] = {"dailyPassengers": passengers}
                elif lat > 30 and lng > 130:
                    for name in find_stations_within(lat, lng, stations, grid, radius=200):
                        counts[name] = {"dailyPassengers": passengers}

    print(f"[passengers] {len(counts)} 駅に乗降客数を割り当て", flush=True)
    return counts


# ═══════════════════════════════════════════════════════════════════
# 6. 家賃収集（国土交通省 不動産取引価格情報）
# ═══════════════════════════════════════════════════════════════════

def collect_rent(stations: dict) -> dict:
    """
    国土交通省 不動産取引価格情報（賃貸）を使って家賃データを収集。
    APIドキュメント: https://www.land.mlit.go.jp/webland/api.html
    ※ 取引価格情報APIは無料・無登録でアクセス可能

    エンドポイント:
      https://www.land.mlit.go.jp/webland/api/TradeListSearch
      ?from=20241&to=20244&city=13101  (都市コード=千代田区)
      &type=3  (中古マンション等)

    type=3 が賃貸に近いが実際は売買価格。賃貸は別途対応が必要。
    現実的には手動DLの CSV データを使う方が精度が高い。
    """
    print("\n[rent] 国土交通省 不動産取引価格情報APIを試みます...", flush=True)

    # 都道府県コード（東京=13, 神奈川=14, 埼玉=11, 千葉=12）
    pref_codes = ["13", "14", "11", "12"]

    grid = build_grid(stations)
    rent_data = {}  # station_name -> [rent_values]

    for pref in pref_codes:
        for quarter_from in ["20241", "20242", "20243", "20244"]:
            url = (
                f"https://www.land.mlit.go.jp/webland/api/TradeListSearch"
                f"?from={quarter_from}&to={quarter_from}&pref={pref}&type=3"
            )
            try:
                if requests:
                    r = requests.get(url, timeout=30,
                                     headers={"User-Agent": "flex-rail-map-stats/2.0"})
                    if r.status_code != 200:
                        continue
                    data = r.json()
                else:
                    req = __import__("urllib.request").request.Request(
                        url, headers={"User-Agent": "flex-rail-map-stats/2.0"}
                    )
                    with __import__("urllib.request").request.urlopen(req, timeout=30) as resp:
                        data = json.loads(resp.read())

                items = data.get("data", [])
                print(f"  pref={pref} quarter={quarter_from}: {len(items)}件", flush=True)

                for item in items:
                    try:
                        lat = float(item.get("Latitude") or 0)
                        lng = float(item.get("Longitude") or 0)
                        price = item.get("TradePrice", "")
                        area = item.get("Area", "")
                        floor_plan = item.get("FloorPlan", "")

                        if not price or lat < 30:
                            continue

                        price_val = int(str(price).replace(",", ""))
                        area_val = float(str(area).replace("㎡未満", "").replace("㎡", "") or 0)

                        # 賃貸物件（TradePrice が異常に低い = 月額賃料の可能性）
                        if price_val < 500000:  # 50万円未満 → 月額賃料とみなす
                            rent_man = round(price_val / 10000, 1)
                        else:
                            continue  # 売買価格はスキップ

                        # 間取りで振り分け
                        for st_name in find_stations_within(lat, lng, stations, grid, radius=800):
                            if st_name not in rent_data:
                                rent_data[st_name] = {"1K": [], "1LDK": []}
                            if "K" in floor_plan and "L" not in floor_plan and area_val < 35:
                                rent_data[st_name]["1K"].append(rent_man)
                            elif "LDK" in floor_plan and "1" in floor_plan:
                                rent_data[st_name]["1LDK"].append(rent_man)

                    except (ValueError, TypeError):
                        continue

                time.sleep(1)
            except Exception as e:
                print(f"  エラー: {e}", flush=True)

    # 平均値に変換
    result = {}
    for name, d in rent_data.items():
        entry = {}
        if d["1K"]:
            entry["avgRent1K"] = round(sum(d["1K"]) / len(d["1K"]), 1)
        if d["1LDK"]:
            entry["avgRent1LDK"] = round(sum(d["1LDK"]) / len(d["1LDK"]), 1)
        if entry:
            result[name] = entry

    print(f"[rent] {len(result)} 駅に家賃データを割り当て", flush=True)
    return result


# ═══════════════════════════════════════════════════════════════════
# 7. 結果のマージ・出力
# ═══════════════════════════════════════════════════════════════════

def merge_and_save(collected: dict, output_suffix: str = ""):
    """収集結果を station-stats-data.json にマージして保存"""
    with open(STATS_JSON) as f:
        stats = json.load(f)

    merged_count = 0
    for station_name, new_vals in collected.items():
        if not new_vals:
            continue
        if station_name in stats:
            stats[station_name].update(new_vals)
            merged_count += 1
        # else: station-stats-data.json に存在しない駅はスキップ

    if "_meta" in stats:
        stats["_meta"]["lastUpdated"] = date.today().isoformat()

    # バックアップ
    backup = OUTPUT_DIR / f"station-stats-backup-{date.today()}{output_suffix}.json"
    import shutil
    shutil.copy(STATS_JSON, backup)
    print(f"[save] バックアップ: {backup}", flush=True)

    with open(STATS_JSON, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, separators=(",", ":"))

    print(f"[save] {merged_count} 駅を更新: {STATS_JSON}", flush=True)

    # 中間結果も保存
    out = OUTPUT_DIR / f"collected{output_suffix}-{date.today()}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(collected, f, ensure_ascii=False, indent=2)
    print(f"[save] 収集結果: {out}", flush=True)


# ═══════════════════════════════════════════════════════════════════
# メイン
# ═══════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="駅別統計データ収集スクリプト")
    parser.add_argument("mode", choices=["overpass", "population", "passengers", "rent", "all"],
                        help="収集モード")
    parser.add_argument("--population-csv", help="e-statからDLした人口CSVのパス")
    parser.add_argument("--passengers-zip", help="国土数値情報N05のZIPパス")
    parser.add_argument("--no-merge", action="store_true", help="station-stats-data.json を更新しない")
    args = parser.parse_args()

    print("=== 駅別統計データ収集 ===", flush=True)
    stations = extract_stations_from_ts()

    if not stations:
        print("ERROR: 駅データが取得できませんでした。src/data/*.ts を確認してください。")
        sys.exit(1)

    all_collected = {}

    if args.mode in ("overpass", "all"):
        print("\n── Overpass施設収集 ──────────────────────────", flush=True)
        result = collect_overpass(stations)
        for name, vals in result.items():
            all_collected.setdefault(name, {}).update(vals)
        if not args.no_merge:
            merge_and_save(result, "-overpass")

    if args.mode in ("population", "all"):
        print("\n── 人口密度収集 ─────────────────────────────", flush=True)
        if args.population_csv:
            result = load_population_csv(args.population_csv, stations)
        else:
            result = collect_population(stations)
        if result and not args.no_merge:
            for name, vals in result.items():
                all_collected.setdefault(name, {}).update(vals)
            merge_and_save(result, "-population")

    if args.mode in ("passengers", "all"):
        print("\n── 乗降客数収集 ─────────────────────────────", flush=True)
        if args.passengers_zip:
            result = collect_passengers_from_zip(args.passengers_zip, stations)
            if result and not args.no_merge:
                for name, vals in result.items():
                    all_collected.setdefault(name, {}).update(vals)
                merge_and_save(result, "-passengers")
        else:
            print("  --passengers-zip を指定してください")
            print("  DL: https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N05.html")

    if args.mode in ("rent", "all"):
        print("\n── 家賃収集 ──────────────────────────────────", flush=True)
        result = collect_rent(stations)
        if result and not args.no_merge:
            for name, vals in result.items():
                all_collected.setdefault(name, {}).update(vals)
            merge_and_save(result, "-rent")

    if args.mode == "all" and all_collected:
        merge_and_save(all_collected, "-all")

    print("\n=== 完了 ===", flush=True)


if __name__ == "__main__":
    main()
