/**
 * 立体表示の駅（小さな点と駅名）のための純粋関数。
 *
 * - 駅は表示中の路線の駅を、同じ名前・近い位置なら1つにまとめる（乗換駅は通る路線の数を数える）
 * - 駅名は画面上で重ならないものだけを出す。通る路線が多い駅（乗換駅）を先に置く
 *   （小さく・シンプルに。全部の駅名を出して地図を埋めない）
 */
import type { RouteKey } from '../data/routes';

export interface TerrainStation {
  name: string;
  lat: number;
  lng: number;
  /** この駅を通る、表示中の路線の数（駅名を出す順番に使う） */
  routeCount: number;
  /** 接続する表示中の路線。色の算出に利用 */
  routeKeys: RouteKey[];
}

/** 同じ名前の駅をまとめる距離（km）。これより離れた同名の駅は別の駅として扱う（同名別駅） */
export const SAME_STATION_KM = 1;

const distKm = (aLat: number, aLng: number, bLat: number, bLng: number) =>
  Math.hypot((aLat - bLat) * 110.54, (aLng - bLng) * 111.32 * Math.cos(((aLat + bLat) / 2) * Math.PI / 180));

/** 表示中の路線の駅を集める。exclude の駅名（出発・到着など、別の印を付ける駅）は除く */
export function collectTerrainStations(
  routeKeys: Iterable<RouteKey>,
  stationsOf: (key: RouteKey) => { name: string; lat: number; lng: number }[] | undefined,
  exclude: Set<string> = new Set(),
): TerrainStation[] {
  const out: TerrainStation[] = [];
  const byName = new Map<string, TerrainStation[]>();
  for (const key of routeKeys) {
    const seenOnRoute = new Set<TerrainStation>();
    for (const s of stationsOf(key) ?? []) {
      if (exclude.has(s.name)) continue;
      const same = (byName.get(s.name) ?? []).find(t => distKm(t.lat, t.lng, s.lat, s.lng) <= SAME_STATION_KM);
      if (same) {
        if (!seenOnRoute.has(same)) { same.routeCount++; same.routeKeys.push(key); seenOnRoute.add(same); }
        continue;
      }
      const station: TerrainStation = { name: s.name, lat: s.lat, lng: s.lng, routeCount: 1, routeKeys: [key] };
      seenOnRoute.add(station);
      out.push(station);
      byName.set(s.name, [...(byName.get(s.name) ?? []), station]);
    }
  }
  return out;
}

export interface LabelBox { x: number; y: number; w: number; h: number; priority: number }

/**
 * 重ならない駅名を選ぶ（画面座標の箱）。priority の大きい順に置き、すでに置いた箱と重なるものは出さない。
 * 返すのは candidates の添字（置いた順）
 */
export function placeLabels(candidates: LabelBox[], max: number, margin = 0): number[] {
  const order = candidates.map((_, i) => i).sort((a, b) => candidates[b].priority - candidates[a].priority);
  const placed: LabelBox[] = [];
  const picked: number[] = [];
  for (const i of order) {
    if (picked.length >= max) break;
    const c = candidates[i];
    const hit = placed.some(p =>
      c.x < p.x + p.w + margin && p.x < c.x + c.w + margin && c.y < p.y + p.h + margin && p.y < c.y + c.h + margin);
    if (hit) continue;
    placed.push(c);
    picked.push(i);
  }
  return picked;
}

/** 駅名の幅の見積もり（px）。全角は1文字ぶん、半角は0.6文字ぶん（DOM を測らずに重なりを判定するため） */
export function estimateLabelWidth(text: string, fontPx: number): number {
  let w = 0;
  for (const ch of text) w += ch.charCodeAt(0) > 0xff ? 1 : 0.6;
  return w * fontPx;
}
