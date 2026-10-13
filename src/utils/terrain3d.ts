/**
 * 立体（標高）表示（Terrain3DView）のための純粋関数とデータの形。
 *
 * データは public/data/terrain3d-lines.json（scripts/line-geometry/build-terrain3d.mts が作る）。
 * 高さは**線路の下の地面の標高**で、線路自体の高さではない（地下鉄は地下を、高架は地面より上を走る）。
 * docs/track-geometry.md「高さの決まり」: 地形の標高と線路自体の標高を混ぜない。
 */
import type { RouteKey } from '../data/routes';

/** 表示用データの置き場所 */
export const TERRAIN3D_DATA_URL = '/data/terrain3d-lines.json';

/** 高さの強調倍率（水平の距離に比べて標高差は小さいので、そのままでは平らに見える） */
export const TERRAIN3D_EXAGGERATION = { min: 1, max: 30, step: 1, default: 10 } as const;

export type Terrain3DPoint = [lat: number, lng: number, elevationM: number];

export interface Terrain3DRoute {
  key: RouteKey;
  osmRelId: number;
  osmName: string;
  paths: Terrain3DPoint[][];
}

export interface Terrain3DData {
  meta: {
    lineSource: { sourceName: string; sourceUrl: string; license: string; retrievedAt: string };
    elevationSource: { sourceName: string; sourceUrl: string; license: string; retrievedAt: string; accuracyNote?: string };
    heightMeaning: 'terrain';
    heightReference: string;
  };
  routes: Terrain3DRoute[];
}

/** 表示中の路線のうち、立体のデータがある路線（表示中の順を保つ） */
export function selectTerrainRoutes(data: Terrain3DData, visible: Iterable<RouteKey>): Terrain3DRoute[] {
  const byKey = new Map(data.routes.map(r => [r.key, r]));
  const out: Terrain3DRoute[] = [];
  for (const k of visible) {
    const r = byKey.get(k);
    if (r) out.push(r);
  }
  return out;
}

/** 平面に直すときの原点と縮尺（km 単位） */
export interface LocalFrame {
  lat0: number;
  lng0: number;
  /** 経度1度あたりの km（原点の緯度で） */
  kmPerLng: number;
}

const KM_PER_LAT = 110.54;

/** 点の範囲の中心を原点にする */
export function frameFor(routes: Terrain3DRoute[]): LocalFrame | null {
  let s = 90, n = -90, w = 180, e = -180, count = 0;
  for (const r of routes) for (const p of r.paths) for (const [lat, lng] of p) {
    s = Math.min(s, lat); n = Math.max(n, lat); w = Math.min(w, lng); e = Math.max(e, lng); count++;
  }
  if (count === 0) return null;
  const lat0 = (s + n) / 2;
  const lng0 = (w + e) / 2;
  return { lat0, lng0, kmPerLng: 111.32 * Math.cos(lat0 * Math.PI / 180) };
}

/**
 * 緯度経度・標高を3次元の座標（km）にする。x=東、y=上、z=南（three.js の右手系で北が奥）。
 * 標高は m を km にして exaggeration 倍する
 */
export function toLocal(frame: LocalFrame, lat: number, lng: number, elevationM: number, exaggeration: number): [number, number, number] {
  return [
    (lng - frame.lng0) * frame.kmPerLng,
    (elevationM / 1000) * exaggeration,
    -(lat - frame.lat0) * KM_PER_LAT,
  ];
}

/** 表示範囲の大きさ（km）。カメラの距離と地面の格子の大きさに使う */
export function extentKm(frame: LocalFrame, routes: Terrain3DRoute[]): number {
  let max = 1;
  for (const r of routes) for (const p of r.paths) for (const [lat, lng] of p) {
    const [x, , z] = toLocal(frame, lat, lng, 0, 1);
    max = Math.max(max, Math.abs(x), Math.abs(z));
  }
  return max * 2;
}

/**
 * 点から、表示中の線形（線分の連なり）までのいちばん近いところ。
 * 線形は間引いてあり、まっすぐな区間には頂点が少ないので、頂点ではなく線分で測る。
 * 標高は線分の両端の値を距離で按分する（画面に描いている線そのものの高さ）
 */
export function nearestOnPaths(routes: Terrain3DRoute[], lat: number, lng: number): { km: number; elevationM: number } | null {
  const kmPerLng = 111.32 * Math.cos(lat * Math.PI / 180);
  let best: { km: number; elevationM: number } | null = null;
  for (const r of routes) for (const p of r.paths) {
    for (let i = 0; i < p.length; i++) {
      const [la, ln, ea] = p[i];
      const ax = (ln - lng) * kmPerLng, ay = (la - lat) * KM_PER_LAT;
      let t = 0, bx = ax, by = ay, eb = ea;
      if (i + 1 < p.length) {
        const [lb, lnb, e2] = p[i + 1];
        bx = (lnb - lng) * kmPerLng; by = (lb - lat) * KM_PER_LAT; eb = e2;
        const dx = bx - ax, dy = by - ay;
        const len2 = dx * dx + dy * dy;
        t = len2 > 0 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2)) : 0;
      }
      const km = Math.hypot(ax + t * (bx - ax), ay + t * (by - ay));
      if (!best || km < best.km) best = { km, elevationM: ea + t * (eb - ea) };
    }
  }
  return best;
}

/**
 * 駅（出発・到着）の印を置く高さ。表示中の線形の中で駅にいちばん近いところの標高を使う
 * （駅ごとの標高は線形と同じ出典ではないので混ぜない）。近くに線形が無ければ null（印を描かない）
 */
export function elevationNear(routes: Terrain3DRoute[], lat: number, lng: number, maxKm = 0.5): number | null {
  const near = nearestOnPaths(routes, lat, lng);
  return near && near.km <= maxKm ? near.elevationM : null;
}
