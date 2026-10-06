import type { Station } from '../data/yamanote';
import { isSameStation } from './sameStation';

export type StationNavigationKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

type RouteStationMap = Record<string, readonly Station[]>;

const DIRECTION_VECTOR: Record<StationNavigationKey, readonly [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

/**
 * 現在駅に接続する「隣駅」の中から、押された矢印キーの画面方向に
 * 最も近い駅を返す。
 *
 * まず表示中の路線だけを対象にし、現在駅を通る表示路線が無い場合のみ
 * 全路線へフォールバックする。乗換駅では複数路線の隣駅を候補にできるため、
 * 十字キーで自然に枝分かれ方向へ移動できる。
 */
export function findDirectionalStation(
  current: Station,
  routeStations: RouteStationMap,
  visibleRoutes: ReadonlySet<string>,
  key: StationNavigationKey,
): Station | null {
  const touchingRoutes = Object.entries(routeStations)
    .filter(([, stations]) => stations.some(station => isSameStation(station, current)));

  const visibleTouchingRoutes = touchingRoutes
    .filter(([routeKey]) => visibleRoutes.has(routeKey));

  const sourceRoutes = visibleTouchingRoutes.length > 0
    ? visibleTouchingRoutes
    : touchingRoutes;

  const candidates: Station[] = [];

  for (const [, stations] of sourceRoutes) {
    const currentIndex = stations.findIndex(station => isSameStation(station, current));
    if (currentIndex < 0) continue;

    for (const neighborIndex of [currentIndex - 1, currentIndex + 1]) {
      const candidate = stations[neighborIndex];
      if (!candidate) continue;

      // 同じ駅が複数路線に含まれていても候補は1つにまとめる。
      if (!candidates.some(existing => isSameStation(existing, candidate))) {
        candidates.push(candidate);
      }
    }
  }

  if (candidates.length === 0) return null;

  const [targetX, targetY] = DIRECTION_VECTOR[key];
  const cosLat = Math.cos(current.lat * Math.PI / 180);

  let best: Station | null = null;
  let bestScore = -Infinity;

  for (const candidate of candidates) {
    // 地理座標を画面方向へ近似変換する（東=右、南=下）。
    const dx = (candidate.lng - current.lng) * cosLat;
    const dy = -(candidate.lat - current.lat);
    const distance = Math.hypot(dx, dy);
    if (distance === 0) continue;

    const alignment = (dx * targetX + dy * targetY) / distance;

    // ほぼ反対方向や真横の駅は、そのキーの候補にしない。
    if (alignment < 0.2) continue;

    // 方向一致を最優先し、同程度なら近い隣駅を選ぶ。
    const score = alignment * 100 - distance * 1000;
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}
