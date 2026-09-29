/**
 * 首都圏駅周辺の施設数（半径800m, OSM）を src/data/station-stats-data.json に取り込む。
 *
 * 入力: data/kanto-poi-800m-2026-09/station-stats-data.kanto800.fill.json（駅名 → 800m系の値）
 *       data/kanto-poi-800m-2026-09/coverage.csv（収集に使った駅の位置: OSM railway=station ノード）
 * 出力: src/data/station-stats-data.json（足りないフィールドだけ足す。既存の値は上書きしない）
 *       data/kanto-poi-800m-2026-09/validation.json（検証結果。取り込んだ駅・保留した駅と理由）
 *
 * 取り込む前に確かめること（どれかに当たる駅は取り込まず保留にする）:
 * - 収集に使った位置が、アプリの同じ名前の駅から 800m 以内にある（別の駅の値を付けない）
 * - アプリに同じ名前で 2km 以上離れた駅が無い（駅統計は駅名だけで引くので、別の地域の同名駅にも同じ値が出てしまう）
 * - 全部の項目が 0 ではない（Overpass の取得失敗が 0 件として保存された疑い）
 *
 * 何度実行しても同じ結果になる。使い方: npx tsx scripts/merge-kanto-poi-800m.mts
 * 手順と判断基準は docs/data-editing-guide.md の「駅周辺の施設数（800m）」。
 */
import { readFileSync, writeFileSync } from 'fs';
import { routes } from '../src/data/routes';

const DIR = 'data/kanto-poi-800m-2026-09';
const TARGET = 'src/data/station-stats-data.json';
const MAX_MATCH_KM = 0.8;
const AMBIGUOUS_SPREAD_KM = 2;

type Fields = Record<string, number>;
const fill = JSON.parse(readFileSync(`${DIR}/station-stats-data.kanto800.fill.json`, 'utf-8')) as Record<string, Fields>;
const target = JSON.parse(readFileSync(TARGET, 'utf-8')) as Record<string, Record<string, unknown>>;

const coverage = new Map<string, [number, number]>();
const [header, ...lines] = readFileSync(`${DIR}/coverage.csv`, 'utf-8').replace(/^﻿/, '').trim().split('\n');
const col = header.split(',');
for (const line of lines) {
  const c = line.split(',');
  coverage.set(c[col.indexOf('station_name')], [Number(c[col.indexOf('lat')]), Number(c[col.indexOf('lng')])]);
}

const appCoords = new Map<string, [number, number][]>();
for (const list of Object.values(routes)) {
  for (const s of list as Array<{ name: string; lat: number; lng: number }>) {
    const arr = appCoords.get(s.name) ?? [];
    arr.push([s.lat, s.lng]);
    appCoords.set(s.name, arr);
  }
}

const km = ([a, b]: [number, number], [c, d]: [number, number]) => {
  const p = Math.PI / 180;
  return 6371 * Math.hypot((d - b) * p * Math.cos(((a + c) / 2) * p), (c - a) * p);
};

const applied: string[] = [];
const unchanged: string[] = [];
const held: { station: string; reason: string }[] = [];
for (const [name, fields] of Object.entries(fill)) {
  const at = coverage.get(name);
  const pts = appCoords.get(name) ?? [];
  const entry = target[name];
  if (!entry) { held.push({ station: name, reason: 'アプリの駅統計に無い駅' }); continue; }
  if (!at) { held.push({ station: name, reason: '収集位置（coverage.csv）が無い' }); continue; }
  if (pts.length === 0) { held.push({ station: name, reason: 'アプリの路線データに無い駅名' }); continue; }
  const spread = Math.max(...pts.flatMap(a => pts.map(b => km(a, b))));
  if (spread > AMBIGUOUS_SPREAD_KM) {
    held.push({ station: name, reason: `同じ名前の駅がアプリに複数あり ${spread.toFixed(0)}km 離れている（駅名だけで引くため、別の駅にも同じ値が出る）` });
    continue;
  }
  const dist = Math.min(...pts.map(p => km(at, p)));
  if (dist > MAX_MATCH_KM) { held.push({ station: name, reason: `収集位置がアプリの駅から ${dist.toFixed(2)}km 離れている` }); continue; }
  if (Object.values(fields).every(v => v === 0)) { held.push({ station: name, reason: '全項目が0（取得失敗の疑い）' }); continue; }
  let added = false;
  for (const [k, v] of Object.entries(fields)) {
    if (!(k in entry)) { entry[k] = v; added = true; }
  }
  (added ? applied : unchanged).push(name);
}

writeFileSync(TARGET, JSON.stringify(target));
writeFileSync(`${DIR}/validation.json`, JSON.stringify({
  checkedAt: new Date().toISOString().slice(0, 10),
  rules: { maxMatchKm: MAX_MATCH_KM, ambiguousSpreadKm: AMBIGUOUS_SPREAD_KM },
  counts: { input: Object.keys(fill).length, applied: applied.length, alreadyApplied: unchanged.length, held: held.length },
  held,
  applied: [...applied, ...unchanged].sort(),
}, null, 1) + '\n');
console.log(`input=${Object.keys(fill).length} applied=${applied.length} alreadyApplied=${unchanged.length} held=${held.length}`);
