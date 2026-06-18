import { routes, routeColors, routeNames } from '../data/routes';
import type { RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';

export type GpsPoint = {
  lat: number;
  lng: number;
  timestamp: number;
};

export type DetectedRoute = {
  routeKey: RouteKey;
  routeName: string;
  routeColor: string;
  directionIndex: 0 | 1;
  terminalStation: string;
  nextStation: string;
  estimatedMinutes: number | null;
  confidence: number;
};

const EARTH_R = 6371000;
const toRad = (d: number) => d * Math.PI / 180;

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

function pointToSegmentDistance(
  lat: number, lng: number,
  aLat: number, aLng: number,
  bLat: number, bLng: number
): number {
  const ax = aLng - lng, ay = aLat - lat;
  const abx = bLng - aLng, aby = bLat - aLat;
  const abLen2 = abx * abx + aby * aby;
  if (abLen2 === 0) return haversineDistance(lat, lng, aLat, aLng);
  const t = Math.max(0, Math.min(1, ((-ax) * abx + (-ay) * aby) / abLen2));
  return haversineDistance(lat, lng, aLat + t * aby, aLng + t * abx);
}

function angularDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % (2 * Math.PI);
  if (d > Math.PI) d = 2 * Math.PI - d;
  return d;
}

const MIN_SPEED_MS = 4;           // 約15km/h以上を電車移動とみなす
const MAX_DIST_M = 300;           // 路線セグメントへの最大距離
const DEFAULT_SPEED_MS = 30000 / 3600; // 速度不明時のデフォルト: 30km/h

export function detectCurrentRoute(gpsHistory: GpsPoint[]): DetectedRoute | null {
  if (gpsHistory.length < 1) return null;

  const cur = gpsHistory[gpsHistory.length - 1];

  let heading: number | null = null;
  let speedMs = 0;

  if (gpsHistory.length >= 2) {
    const prev = gpsHistory[gpsHistory.length - 2];
    const dt = (cur.timestamp - prev.timestamp) / 1000;
    if (dt > 0.5) {
      const dist = haversineDistance(prev.lat, prev.lng, cur.lat, cur.lng);
      speedMs = dist / dt;
      if (speedMs >= MIN_SPEED_MS) {
        const dLat = cur.lat - prev.lat;
        const dLng = (cur.lng - prev.lng) * Math.cos(toRad((cur.lat + prev.lat) / 2));
        heading = Math.atan2(dLng, dLat);
      }
    }
  }

  let bestScore = -1;
  let best: DetectedRoute | null = null;

  for (const [routeKey, stas] of Object.entries(routes) as [RouteKey, Station[]][]) {
    if (!stas || stas.length < 2) continue;

    const name = routeNames[routeKey] ?? routeKey;
    const color = routeColors[routeKey] ?? '#888888';

    for (let i = 0; i < stas.length - 1; i++) {
      const A = stas[i], B = stas[i + 1];

      const dist = pointToSegmentDistance(cur.lat, cur.lng, A.lat, A.lng, B.lat, B.lng);
      if (dist > MAX_DIST_M) continue;

      const proxScore = 1 - dist / MAX_DIST_M;

      // セグメント方向 (A→B)
      const segH = Math.atan2(
        (B.lng - A.lng) * Math.cos(toRad(cur.lat)),
        B.lat - A.lat
      );

      for (const dir of [0, 1] as const) {
        const dirH = dir === 0 ? segH : segH + Math.PI;
        let headingScore = 0.5;
        if (heading !== null) {
          headingScore = Math.max(0, 1 - angularDiff(heading, dirH) / Math.PI);
        }

        const score = proxScore * 0.55 + headingScore * 0.45;
        if (score <= bestScore) continue;

        const nextSt = dir === 0 ? B : A;
        const termIdx = dir === 0 ? stas.length - 1 : 0;
        const distToNext = haversineDistance(cur.lat, cur.lng, nextSt.lat, nextSt.lng);
        const effSpeed = speedMs >= MIN_SPEED_MS ? speedMs : DEFAULT_SPEED_MS;
        const estMin = Math.round(distToNext / effSpeed / 60);

        bestScore = score;
        best = {
          routeKey,
          routeName: name,
          routeColor: color,
          directionIndex: dir,
          terminalStation: stas[termIdx].name,
          nextStation: nextSt.name,
          estimatedMinutes: estMin > 0 ? estMin : 1,
          confidence: score,
        };
      }
    }
  }

  return best;
}

/** 全路線から指定キーの路線情報を取得してDetectedRoute形式で返す（手動設定用） */
export function makeManualRoute(
  routeKey: RouteKey,
  directionIndex: 0 | 1,
  currentLat: number,
  currentLng: number
): DetectedRoute | null {
  const stas = routes[routeKey] as Station[] | undefined;
  if (!stas || stas.length < 2) return null;

  const name = routeNames[routeKey] ?? routeKey;
  const color = routeColors[routeKey] ?? '#888888';
  const termIdx = directionIndex === 0 ? stas.length - 1 : 0;
  const terminal = stas[termIdx];

  // 現在地に最も近い駅を探して次の駅を推定
  let minDist = Infinity;
  let nearestIdx = 0;
  for (let i = 0; i < stas.length; i++) {
    const d = haversineDistance(currentLat, currentLng, stas[i].lat, stas[i].lng);
    if (d < minDist) { minDist = d; nearestIdx = i; }
  }

  const nextIdx = directionIndex === 0
    ? Math.min(nearestIdx + 1, stas.length - 1)
    : Math.max(nearestIdx - 1, 0);
  const nextSt = stas[nextIdx];

  const distToNext = haversineDistance(currentLat, currentLng, nextSt.lat, nextSt.lng);
  const estMin = Math.round(distToNext / DEFAULT_SPEED_MS / 60);

  return {
    routeKey,
    routeName: name,
    routeColor: color,
    directionIndex,
    terminalStation: terminal.name,
    nextStation: nextSt.name,
    estimatedMinutes: estMin > 0 ? estMin : 1,
    confidence: 1,
  };
}
