# 取得済み line_cache から路線線形データを構築する。
# 出力:
#   kanto-lines_YYYYMMDD_HHMM.json  (アプリ消費用・出典メタ付き)
#   coverage-matching.csv           (relation×アプリ路線名の対応表)
import json, os, gzip, csv, math, re, datetime

BASE = '/home/user/workspace/flex-railway-map'
CACHEDIR = os.path.join(BASE, 'line_cache')
REPO = '/home/user/workspace/flex-rail-map-project'
OUTDIR = os.path.join(REPO, 'data', 'kanto-line-geometry-2026-10')
os.makedirs(OUTDIR, exist_ok=True)
TH = 80.0  # 駅-線形 近接判定閾値(m)
CELL = 0.01  # 空間ハッシュ格子(約1km)

def hav(la1, lo1, la2, lo2):
    R = 6371000; p = math.pi / 180
    a = math.sin((la2 - la1) * p / 2) ** 2 + math.cos(la1 * p) * math.cos(la2 * p) * math.sin((lo2 - lo1) * p / 2) ** 2
    return 2 * R * math.asin(a ** 0.5)

def app_routes():
    txt = open(os.path.join(REPO, 'src/data/routes.ts'), encoding='utf-8').read()
    m = re.search(r'export const routeNames\s*=\s*\{(.*?)\n\};', txt, re.S)
    block = m.group(1) if m else ''
    pairs = re.findall(r'(\w+)\s*:\s*["\']([^"\'\n]+)["\']', block)
    base = {k: v for k, v in pairs}
    # フォールバック: ファイル全体から 「key: '路線名'」 形式(線/Lineで終わる値)も収集
    for k, v in re.findall(r'(\w+)\s*:\s*["\']([^"\'\n]+)["\']', txt_open := open(os.path.join(REPO, 'src/data/routes.ts'), encoding='utf-8').read()):
        if v.endswith('線') or v.endswith('Line') or 'ライン' in v:
            base.setdefault(k, v)
    return base

def norm(s):
    return re.sub(r'[\s\u3000]', '', s or '')

def chain_ways(ways):
    """ways: [[id, refs, geom, rt]] → ノード接続でチェーン化したポリライン群"""
    adj = {}
    allpts = {}
    for wid, refs, geom, rt in ways:
        rr = [r for i, r in enumerate(refs) if i == 0 or r != refs[i - 1]]
        if len(rr) < 2:
            continue
        for i in range(len(rr) - 1):
            a, b = rr[i], rr[i + 1]
            adj.setdefault(a, set()).add(b)
            adj.setdefault(b, set()).add(a)
        for r, g in zip(rr, geom):
            allpts[r] = g
    if not allpts:
        return []
    used = set()
    out = []

    def walk(start):
        line = [start]
        cur = start
        while True:
            cand = [n for n in adj.get(cur, []) if (cur, n) not in used]
            if not cand:
                break
            n = cand[0]
            used.add((cur, n)); used.add((n, cur))
            line.append(n)
            cur = n
            if cur == start:
                break
        return line

    # 未使用辺が残る限り、次数1(端点)を起点に歩く→閉路は任意の辺から
    endpoints = [n for n, nb in adj.items() if len(nb) == 1]
    starts = endpoints if endpoints else list(adj.keys())
    for s in starts:
        if any((s, n) not in used for n in adj.get(s, [])):
            line = walk(s)
            pts = [allpts[r] for r in line if r in allpts]
            if len(pts) >= 2:
                out.append(pts)
    out.sort(key=lambda p: -len(p))
    return out

def station_hits(chains, stations):
    """空間ハッシュで駅×頂点の近接判定(80m)"""
    grid = {}
    for c in chains:
        for la, lo in c[::3]:
            grid.setdefault((round(la / CELL), round(lo / CELL)), []).append((la, lo))
    n = 0
    for s in stations:
        la, lo = s['lat'], s['lon']
        gy, gx = round(la / CELL), round(lo / CELL)
        ok = False
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                for a in grid.get((gy + dy, gx + dx), ()):  # 頂点ベース概算
                    if hav(a[0], a[1], la, lo) <= TH:
                        ok = True; break
                if ok: break
            if ok: break
        if ok:
            n += 1
    return n

def main():
    ts = datetime.datetime.now().strftime('%Y%m%d_%H%M')
    rels = json.load(open(os.path.join(BASE, 'line_rel_list.json')))
    master = json.load(open(os.path.join(BASE, 'stations_kanto_master.json')))
    stations = master['stations']
    names = app_routes()
    by_name = {}
    for k, v in names.items():
        by_name.setdefault(norm(v), []).append(k)

    lines, rows = [], []
    for r in rels:
        rid = r['id']
        p = os.path.join(CACHEDIR, f'r_{rid}.json.gz')
        if not os.path.exists(p):
            continue
        ways = []
        with gzip.open(p, 'rt') as f:
            for line in f:
                if not line:
                    continue
                wid, refs, geom, rt = json.loads(line)
                if rt == 'platform':
                    continue
                ways.append((wid, refs, geom, rt))
        chains = chain_ways(ways)
        if not chains:
            continue
        tags = r.get('tags', {})
        name = tags.get('name') or tags.get('ref') or ''
        op = tags.get('operator') or ''
        rt = tags.get('route') or ''
        colour = tags.get('colour') or ''
        hits = station_hits(chains, stations)
        key = norm(name)
        matched = by_name.get(key, [])
        if not matched and name:
            for nk, kv in by_name.items():
                if nk and (nk in key or key in nk):
                    matched = kv; break
        lines.append({
            'relId': rid, 'lineName': name or None, 'operator': op or None,
            'routeType': rt, 'colour': colour or None,
            'isShinkansen': '新幹線' in name,
            'nChains': len(chains),
            'totalKm': round(sum(hav(a[0], a[1], b[0], b[1]) for c in chains for a, b in zip(c, c[1:])) / 1000, 1),
            'masterStationHits': hits,
            'appRouteKeys': matched,
            'paths': chains,
            'source': {
                'sourceName': 'OpenStreetMap (Overpass API / overpass.private.coffee)',
                'sourceUrl': 'https://overpass.private.coffee/api/interpreter',
                'retrievedAt': '2026-10-11',
                'license': 'ODbL (c) OpenStreetMap contributors'
            }
        })
        rows.append({'relId': rid, 'lineName': name, 'operator': op, 'routeType': rt,
                     'chains': len(chains), 'masterStationHits': hits,
                     'appRouteKeys': ';'.join(matched), 'cachedWays': len(ways)})

    lines.sort(key=lambda x: -x['masterStationHits'])
    out = {
        'meta': {
            'generatedAt': datetime.datetime.now().isoformat(),
            'sourceName': 'OpenStreetMap (Overpass API / overpass.private.coffee)',
            'sourceUrl': 'https://overpass.private.coffee/api/interpreter',
            'retrievedAt': '2026-10-11',
            'license': 'ODbL (c) OpenStreetMap contributors',
            'definition': 'OSM route relation(train/subway/tram/monorail/light_rail)のmember wayをノード接続でチェーン化した線形。paths=[[lat,lon],...]。',
            'coverageNote': '首都圏bbox(34.50-36.40N, 138.70-141.10E)と交差するrelation全域(他県区間を含む)',
            'stationHitsThreshold': '80m(頂点ベース概算)'
        },
        'lineCount': len(lines),
        'lines': lines
    }
    fn = f'kanto-lines_{ts}.json'
    json.dump(out, open(os.path.join(OUTDIR, fn), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(OUTDIR, 'coverage-matching.csv'), 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=['relId', 'lineName', 'operator', 'routeType', 'chains', 'masterStationHits', 'appRouteKeys', 'cachedWays'])
        w.writeheader()
        w.writerows(rows)
    matched_n = sum(1 for r in rows if r['appRouteKeys'])
    print(f'LINES={len(lines)} matched={matched_n}/{len(rows)} out={fn}')
    print('TOP:', [(r['lineName'], r['masterStationHits']) for r in rows[:10]])

if __name__ == '__main__':
    main()
