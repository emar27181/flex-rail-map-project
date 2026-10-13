# 首都圏の全鉄道路線線形をOSM route relationから取得する(レジューム可・逐次保存)。
# 使い方: python3 line_geo_fetch.py [--minutes 15]
# キャッシュ: line_cache/r_<relid>.json.gz  (way: [id, refs, geometry, railwayTag])
import json, os, sys, time, gzip, subprocess, argparse

BASE = '/home/user/workspace/flex-railway-map'
CACHEDIR = os.path.join(BASE, 'line_cache')
EPS = ['https://overpass.osm.jp/api/interpreter',
       'https://overpass.private.coffee/api/interpreter',
       'https://overpass-api.de/api/interpreter',
       'https://overpass.kumi.systems/api/interpreter']
EP = EPS[0]
BBOX = '34.50,138.70,36.40,141.10'  # 東京/神奈川/埼玉/千葉を完全被覆
ROUTES = 'train|subway|tram|monorail|light_rail'
os.makedirs(CACHEDIR, exist_ok=True)

def overpass(q, outf, timeout=170):
    global EP
    if os.path.exists(outf):
        os.remove(outf)
    for _ in range(3):
        try:
            subprocess.run(["curl", "-sS", "-m", str(timeout - 10), "-A", "Mozilla/5.0",
                            "--data-urlencode", "data=" + q, EP, "-o", outf],
                           capture_output=True, text=True, timeout=timeout)
            d = json.load(open(outf))
            if 'elements' in d:
                return True
        except subprocess.TimeoutExpired:
            pass
        except Exception:
            pass
        EP = EPS[(EPS.index(EP) + 1) % len(EPS)]
        time.sleep(4)
    return False

def list_relations():
    outf = os.path.join(BASE, 'line_rel_list.json')
    if os.environ.get('REUSE_LIST') == '1' and os.path.exists(outf):
        try:
            rels = json.load(open(outf))
            if rels:
                print(f'REUSING_LIST={len(rels)}')
                return rels
        except Exception:
            pass
    q = (f'[out:json][timeout:120];'
         f'rel["route"~"^{ROUTES}$"]({BBOX});out tags;')
    for attempt in range(4):
        if overpass(q, outf):
            d = json.load(open(outf))
            rels = d['elements']
            json.dump(rels, open(outf, 'w'), ensure_ascii=False)
            print(f'RELATIONS={len(rels)}')
            return rels
        time.sleep(10)
    print('RELATION_LIST_FAILED'); sys.exit(1)

def rel_path(rid):
    return os.path.join(CACHEDIR, f'r_{rid}.json.gz')

def fetch_members(rid):
    """bbox内の member way(railway系)のみ取得し [id, refs, geom, railwayTag] のgzip JSON linesで保存"""
    q = (f'[out:json][timeout:150];'
         f'rel(id:{rid});way(r)["railway"~"^(rail|light_rail|monorail|subway|tram)$"]({BBOX});out geom;')
    outf = os.path.join(BASE, 'line_tmp.json')
    for attempt in range(2):
        if overpass(q, outf):
            try:
                d = json.load(open(outf))
                rows = []
                for el in d['elements']:
                    if el.get('type') != 'way' or 'geometry' not in el:
                        continue
                    refs = el.get('nodes') or []
                    geom = [[round(g['lat'], 6), round(g['lon'], 6)] for g in el['geometry']]
                    rt = (el.get('tags') or {}).get('railway', '')
                    if not refs:
                        # refs無しの場合はway内連続性だけ再現する擬似refs
                        refs = [-(el['id'] * 1000000 + i) for i in range(len(geom))]
                    rows.append(json.dumps([el['id'], refs, geom, rt], separators=(',', ':')))
                with gzip.open(rel_path(rid), 'wt') as f:
                    f.write('\n'.join(rows))
                return len(rows)
            except Exception:
                pass
        time.sleep(8)
    return None

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--minutes', type=int, default=15)
    a = ap.parse_args()
    deadline = time.time() + a.minutes * 60
    rels = list_relations()
    fails = {}
    fp = os.path.join(BASE, 'line_failures.json')
    if os.path.exists(fp):
        fails = json.load(open(fp))
    todo = [r for r in rels if not os.path.exists(rel_path(r['id']))]
    # 有名路線(名称+事業者)を優先 → 未失敗 → id順
    def prio(r):
        t = r.get('tags', {})
        tier = 0 if (t.get('name') and t.get('operator')) else (1 if t.get('name') else 2)
        return (tier, fails.get(str(r['id']), 0), r['id'])
    todo.sort(key=prio)
    print(f'PENDING={len(todo)}')
    done = failed = 0
    for r in todo:
        if time.time() > deadline:
            print('deadline reached')
            break
        rid = r['id']
        n = fetch_members(rid)
        if n is None:
            fails[str(rid)] = fails.get(str(rid), 0) + 1
            failed += 1
            print(f'rel {rid} FAILED (count={fails[str(rid)]})')
        else:
            done += 1
            print(f'rel {rid} ok ways={n}')
    json.dump(fails, open(fp, 'w'))
    cached = sum(1 for r in rels if os.path.exists(rel_path(r['id'])))
    print(f'SUMMARY relations={len(rels)} cached={cached} fetched_this_run={done} failed_now={failed}')
