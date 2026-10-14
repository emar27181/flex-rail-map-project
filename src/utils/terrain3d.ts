/**
 * 立体（標高）表示（Terrain3DView）のための純粋関数とデータの形。
 *
 * データは public/data/terrain3d-lines.json（scripts/line-geometry/build-terrain3d.mts が作る）。
 * 高さは**線路の下の地面の標高**で、線路自体の高さではない（地下鉄は地下を、高架は地面より上を走る）。
 * docs/track-geometry.md「高さの決まり」: 地形の標高と線路自体の標高を混ぜない。
 */
import type { RouteKey } from '../data/routes';

/** 表示用データの置き場所（v1）。版ごとの置き場所は TERRAIN3D_DATA_URLS */
export const TERRAIN3D_DATA_URL = '/data/terrain3d-lines.json';

/** 高さの強調倍率（水平の距離に比べて標高差は小さいので、そのままでは平らに見える） */
export const TERRAIN3D_EXAGGERATION = { min: 1, max: 30, step: 1, default: 10 } as const;

export type Terrain3DPoint = [lat: number, lng: number, elevationM: number];

export interface Terrain3DRoute {
  key: RouteKey;
  osmRelId: number;
  osmName: string;
  paths: Terrain3DPoint[][];
  /** 線形データ v2 のみ: paths と同じ並びで、その線の区間の構造（地上・高架・地下） */
  structures?: Terrain3DStructure[];
}

// ─── 線形データの版 ───────────────────────────────────────────────
// v1: 線形ごとに地面の標高を持つ（Copernicus DEM, OSM relation 100本から45路線）
// v2: 区間の構造（地上・高架・地下）を持つ。標高は持たない（地面の格子の高さに載せる）。669 relation から80路線

export type Terrain3DVersion = 'v1' | 'v2';
/** 既定は v2（地下の区間が分かる） */
export const TERRAIN3D_DEFAULT_VERSION: Terrain3DVersion = 'v2';
export const TERRAIN3D_DATA_URLS: Record<Terrain3DVersion, string> = {
  v1: '/data/terrain3d-lines.json',
  v2: '/data/terrain3d-lines-v2.json',
};

/** 区間の構造（g=地上, e=高架, u=地下）。OSM の tunnel / bridge などのタグによる種類で、深さ・高さ（m）ではない */
export type Terrain3DStructure = 'g' | 'e' | 'u';
export const TERRAIN3D_STRUCTURES: readonly Terrain3DStructure[] = ['g', 'e', 'u'];

export interface Terrain3DDataV2 {
  meta: {
    version: 2;
    lineSource: { sourceName: string; sourceUrl: string; license: string; retrievedAt: string };
    structure: string;
    heightMeaning: 'none';
  };
  routes: { key: RouteKey; osmRelId: number; osmName: string; runs: { s: Terrain3DStructure; p: [number, number][] }[] }[];
}

/**
 * v2 を、v1 と同じ形（点ごとに標高を持つ線）にそろえる。標高は地面の格子の値（線の下の地面）。
 * 格子の外の点は描かない（高さが分からないので）
 */
export function v2ToRoutes(data: Terrain3DDataV2, ground: Terrain3DGround): Terrain3DRoute[] {
  return data.routes.map(r => {
    const paths: Terrain3DPoint[][] = [];
    const structures: Terrain3DStructure[] = [];
    for (const run of r.runs) {
      const pts = run.p.flatMap(([lat, lng]): Terrain3DPoint[] => {
        const ele = groundElevationAt(ground, lat, lng);
        return ele === null ? [] : [[lat, lng, ele]];
      });
      if (pts.length >= 2) { paths.push(pts); structures.push(run.s); }
    }
    return { key: r.key, osmRelId: r.osmRelId, osmName: r.osmName, paths, structures };
  }).filter(r => r.paths.length > 0);
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
export function selectTerrainRoutes(data: { routes: Terrain3DRoute[] }, visible: Iterable<RouteKey>): Terrain3DRoute[] {
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

// ─── 地面（標高の格子） ─────────────────────────────────────────────
// scripts/line-geometry/terrain_ground_build.py が作る。線形の標高と同じ Copernicus DEM を
// 約500mの格子の平均に縮めたもの。地面を描き、地下に入る線（今後）と地上の線を見分けられるようにする

export const TERRAIN3D_GROUND_META_URL = '/data/terrain3d-ground.json';
export const TERRAIN3D_GROUND_BIN_URL = '/data/terrain3d-ground.bin';

/** 水域の種類（格子の半分以上が水のとき） */
export const GROUND_WATER = { land: 0, ocean: 1, lake: 2, river: 3 } as const;

export interface Terrain3DGroundMeta {
  latMax: number;
  lngMin: number;
  stepDeg: number;
  rows: number;
  cols: number;
  heightMeaning: 'terrain';
  heightReference: string;
  source: { sourceName: string; sourceUrl: string; license: string; retrievedAt: string };
}

export interface Terrain3DGround {
  meta: Terrain3DGroundMeta;
  /** 標高（m）。rows×cols、北の行から・西の列から */
  elevation: Int16Array;
  /** 水域（GROUND_WATER）。並びは elevation と同じ */
  water: Uint8Array;
}

/** .bin（標高 Int16 の後に水域 Uint8）を読み分ける。大きさが合わなければ例外（壊れたデータを描かない） */
export function parseGround(meta: Terrain3DGroundMeta, buffer: ArrayBuffer): Terrain3DGround {
  const n = meta.rows * meta.cols;
  if (buffer.byteLength !== n * 3) throw new Error(`ground: ${buffer.byteLength} bytes, expected ${n * 3}`);
  const view = new DataView(buffer);
  const elevation = new Int16Array(n);
  for (let i = 0; i < n; i++) elevation[i] = view.getInt16(i * 2, true);
  return { meta, elevation, water: new Uint8Array(buffer, n * 2, n) };
}

/** 格子の点（行・列）の中心の緯度経度 */
export function groundCellCenter(meta: Terrain3DGroundMeta, row: number, col: number): [number, number] {
  return [meta.latMax - (row + 0.5) * meta.stepDeg, meta.lngMin + (col + 0.5) * meta.stepDeg];
}

/**
 * その地点の地面の標高（m）。格子の中心の値を双一次補間する（地面の面を描くときと同じ補間）。
 * 格子の外は null
 */
export function groundElevationAt(ground: Terrain3DGround, lat: number, lng: number): number | null {
  const { latMax, lngMin, stepDeg, rows, cols } = ground.meta;
  const fr = (latMax - lat) / stepDeg - 0.5;
  const fc = (lng - lngMin) / stepDeg - 0.5;
  if (fr < 0 || fc < 0 || fr > rows - 1 || fc > cols - 1) return null;
  const r0 = Math.min(Math.floor(fr), rows - 2), c0 = Math.min(Math.floor(fc), cols - 2);
  const tr = fr - r0, tc = fc - c0;
  const at = (r: number, c: number) => Math.max(0, ground.elevation[r * cols + c]);
  const top = at(r0, c0) * (1 - tc) + at(r0, c0 + 1) * tc;
  const bottom = at(r0 + 1, c0) * (1 - tc) + at(r0 + 1, c0 + 1) * tc;
  return top * (1 - tr) + bottom * tr;
}

/** 表示中の路線の範囲（＋余白 marginDeg）にかかる格子の行・列の範囲。かからなければ null */
export function groundWindow(
  ground: Terrain3DGround, routes: Terrain3DRoute[], marginDeg: number,
): { r0: number; r1: number; c0: number; c1: number } | null {
  let s = 90, n = -90, w = 180, e = -180;
  for (const r of routes) for (const p of r.paths) for (const [lat, lng] of p) {
    s = Math.min(s, lat); n = Math.max(n, lat); w = Math.min(w, lng); e = Math.max(e, lng);
  }
  if (s > n) return null;
  const { latMax, lngMin, stepDeg, rows, cols } = ground.meta;
  const r0 = Math.max(0, Math.floor((latMax - (n + marginDeg)) / stepDeg));
  const r1 = Math.min(rows - 1, Math.ceil((latMax - (s - marginDeg)) / stepDeg));
  const c0 = Math.max(0, Math.floor((w - marginDeg - lngMin) / stepDeg));
  const c1 = Math.min(cols - 1, Math.ceil((e + marginDeg - lngMin) / stepDeg));
  return r1 - r0 >= 1 && c1 - c0 >= 1 ? { r0, r1, c0, c1 } : null;
}
