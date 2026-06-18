import { routes, routeColors, routeNames } from '../data/routes';
import type { RouteKey } from '../data/routes';
import type { Station } from '../data/yamanote';

export type GpsPoint = {
  lat: number;
  lng: number;
  timestamp: number;
};

export type StationVisit = {
  stationName: string;
  routeKey: RouteKey;
  stationIndex: number;
  timestamp: number;
  type: 'stopped' | 'passed';
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

export const MIN_SPEED_MS = 4;
const MAX_DIST_M = 300;
export const DEFAULT_SPEED_MS = 30000 / 3600;

// 停車判定: この速度以下かつ駅に近ければ「停車」とみなす
const STOP_SPEED_MS = 2;          // ~7km/h
const STATION_STOP_DIST_M = 120;  // 停車時の駅判定距離
const STATION_PASS_DIST_M = 80;   // 通過時の駅判定距離
const VISIT_DEDUP_MS = 30000;     // 同一駅の重複記録を防ぐウィンドウ

/**
 * GPS位置情報のみによる基本的な路線推定（初期5秒間用）
 */
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

/**
 * 現在地が特定の路線上の駅に近いか確認し、訪問記録を返す。
 * routeKey が指定された場合はその路線のみチェック（効率化）。
 */
export function checkNearStation(
  lat: number,
  lng: number,
  speedMs: number,
  timestamp: number,
  routeKey: RouteKey,
  recentVisits: StationVisit[]
): StationVisit[] {
  const stas = routes[routeKey] as Station[];
  if (!stas || stas.length === 0) return [];

  const isStopped = speedMs < STOP_SPEED_MS;
  const threshold = isStopped ? STATION_STOP_DIST_M : STATION_PASS_DIST_M;
  const type: 'stopped' | 'passed' = isStopped ? 'stopped' : 'passed';
  const results: StationVisit[] = [];

  for (let i = 0; i < stas.length; i++) {
    const s = stas[i];
    const dist = haversineDistance(lat, lng, s.lat, s.lng);
    if (dist > threshold) continue;

    const isDup = recentVisits.some(v =>
      v.stationName === s.name &&
      v.routeKey === routeKey &&
      timestamp - v.timestamp < VISIT_DEDUP_MS
    );
    if (!isDup) {
      results.push({ stationName: s.name, routeKey, stationIndex: i, timestamp, type });
    }
  }
  return results;
}

/**
 * 訪問駅履歴を使った精度向上版路線推定。
 * 2駅以上の履歴がある場合は順序から路線・方向を特定する。
 */
export function detectRouteWithHistory(
  gpsHistory: GpsPoint[],
  visitHistory: StationVisit[]
): DetectedRoute | null {
  // 履歴が少ない場合は基本アルゴリズムにフォールバック
  if (visitHistory.length < 2) {
    return detectCurrentRoute(gpsHistory);
  }

  // 路線ごとに訪問をグループ化
  const routeMap = new Map<RouteKey, StationVisit[]>();
  for (const v of visitHistory) {
    const arr = routeMap.get(v.routeKey) ?? [];
    arr.push(v);
    routeMap.set(v.routeKey, arr);
  }

  let bestRouteKey: RouteKey | null = null;
  let bestDir: 0 | 1 = 0;
  let bestScore = 0;

  for (const [routeKey, visits] of routeMap) {
    if (visits.length < 2) continue;

    // 時刻順にソート
    const sorted = [...visits].sort((a, b) => a.timestamp - b.timestamp);

    // 連続する駅インデックスの増減方向を集計
    let asc = 0, desc = 0;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].stationIndex > sorted[i - 1].stationIndex) asc++;
      else if (sorted[i].stationIndex < sorted[i - 1].stationIndex) desc++;
    }

    // スコア = 一貫した方向の数 + 訪問数（多いほど信頼度高）
    const score = Math.max(asc, desc) * 2 + sorted.length;
    const dir: 0 | 1 = asc >= desc ? 0 : 1;

    if (score > bestScore) {
      bestScore = score;
      bestRouteKey = routeKey;
      bestDir = dir;
    }
  }

  // 十分な証拠がない場合はフォールバック
  if (!bestRouteKey || bestScore < 3) {
    return detectCurrentRoute(gpsHistory);
  }

  const stas = routes[bestRouteKey] as Station[];
  if (!stas || stas.length < 2) return detectCurrentRoute(gpsHistory);

  const cur = gpsHistory[gpsHistory.length - 1];

  // 最後に訪問した駅の次が「次の駅」
  const routeVisits = [...(routeMap.get(bestRouteKey) ?? [])].sort((a, b) => a.timestamp - b.timestamp);
  const lastVisit = routeVisits[routeVisits.length - 1];
  const nextIdx = bestDir === 0
    ? Math.min(lastVisit.stationIndex + 1, stas.length - 1)
    : Math.max(lastVisit.stationIndex - 1, 0);

  const termIdx = bestDir === 0 ? stas.length - 1 : 0;
  const nextSt = stas[nextIdx];

  // 速度推定（GPSから）
  let speedMs = DEFAULT_SPEED_MS;
  if (gpsHistory.length >= 2) {
    const prev = gpsHistory[gpsHistory.length - 2];
    const dt = (cur.timestamp - prev.timestamp) / 1000;
    if (dt > 0.5) {
      const dist = haversineDistance(prev.lat, prev.lng, cur.lat, cur.lng);
      const sp = dist / dt;
      if (sp >= MIN_SPEED_MS) speedMs = sp;
    }
  }

  const distToNext = haversineDistance(cur.lat, cur.lng, nextSt.lat, nextSt.lng);
  const estMin = Math.round(distToNext / speedMs / 60);

  return {
    routeKey: bestRouteKey,
    routeName: routeNames[bestRouteKey] ?? bestRouteKey,
    routeColor: routeColors[bestRouteKey] ?? '#888888',
    directionIndex: bestDir,
    terminalStation: stas[termIdx].name,
    nextStation: nextSt.name,
    estimatedMinutes: estMin > 0 ? estMin : 1,
    confidence: Math.min(bestScore / 8, 1),
  };
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
