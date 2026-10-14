/**
 * 線形の対応付け・間引きに使う計算（build-terrain3d.mts / build-terrain3d-v2.mts で共通）。
 */
export type P3 = [number, number, number];

/** 2点間の距離（m）。数百km以内なので正距円筒近似で足りる */
export function distM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const k = Math.cos(((lat1 + lat2) / 2) * Math.PI / 180);
  return Math.hypot((lat1 - lat2) * 110_540, (lon1 - lon2) * 111_320 * k);
}

export function bbox(points: { lat: number; lng: number }[]) {
  let s = 90, n = -90, w = 180, e = -180;
  for (const p of points) { s = Math.min(s, p.lat); n = Math.max(n, p.lat); w = Math.min(w, p.lng); e = Math.max(e, p.lng); }
  return { s, n, w, e };
}
export const overlaps = (a: ReturnType<typeof bbox>, b: ReturnType<typeof bbox>, padDeg = 0.01) =>
  a.s <= b.n + padDeg && b.s <= a.n + padDeg && a.w <= b.e + padDeg && b.w <= a.e + padDeg;

/** 3次元の Douglas-Peucker（水平は m に直し、標高も m のまま同じ許容誤差で見る）。2次元なら標高を0で渡す */
export function simplify3d(points: P3[], tolM: number): P3[] {
  if (points.length <= 2) return points;
  const lat0 = points[0][0];
  const k = Math.cos(lat0 * Math.PI / 180);
  const xyz = points.map(p => [p[1] * 111_320 * k, p[0] * 110_540, p[2]] as const);
  const keep = new Uint8Array(points.length);
  keep[0] = 1; keep[points.length - 1] = 1;
  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay, az] = xyz[a]; const [bx, by, bz] = xyz[b];
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const len2 = dx * dx + dy * dy + dz * dz;
    let maxD = -1, maxI = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py, pz] = xyz[i];
      let t = len2 > 0 ? ((px - ax) * dx + (py - ay) * dy + (pz - az) * dz) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy), pz - (az + t * dz));
      if (d > maxD) { maxD = d; maxI = i; }
    }
    if (maxD > tolM) { keep[maxI] = 1; stack.push([a, maxI], [maxI, b]); }
  }
  return points.filter((_, i) => keep[i]);
}

export const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;
export const pathKm = (p: P3[]) => p.reduce((s, pt, i) => (i ? s + distM(p[i - 1][0], p[i - 1][1], pt[0], pt[1]) : 0), 0) / 1000;
