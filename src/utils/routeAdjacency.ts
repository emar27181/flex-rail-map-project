import type { Station } from '../data/yamanote';
import { DEFAULT_TIME_TO_NEXT } from './legTime';

/** 末尾から先頭へ戻る路線。描画と最短時間探索で共有する。 */
export const isCircularRoute = (routeKey: string): boolean => routeKey === 'yamanote';

export function adjacentRouteStations(stations: Station[], index: number, routeKey: string) {
  if (stations.length < 2) return [];
  return ([-1, 1] as const).flatMap(direction => {
    let nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= stations.length) {
      if (!isCircularRoute(routeKey)) return [];
      nextIndex = (nextIndex + stations.length) % stations.length;
    }
    const edgeStart = direction === 1 ? index : nextIndex;
    return [{ index: nextIndex, time: stations[edgeStart].timeToNext || DEFAULT_TIME_TO_NEXT }];
  });
}
