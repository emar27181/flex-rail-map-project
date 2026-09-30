/**
 * 現在地が分かったとき、最初に地図へ出す路線を選ぶ（駅が未選択のとき）。
 *
 * - 最寄り駅に路線が複数あるなら、その路線をすべて出す（乗換駅なら十分に手がかりがある）
 * - 最寄り駅に路線が1本しか無いなら、近い駅から順に別の路線を足して MIN_DEFAULT_LINES 本にする。
 *   1本だけだと、どこへ乗り換えられるかが地図から分からないため
 * - 足すのは NEARBY_ROUTE_SEARCH_KM 以内の駅の路線だけ（遠くの路線を出しても手がかりにならない）
 */
import type { RouteKey } from '../data/routes';
import { approxDistanceKm } from './sameStation';

/** 最寄り駅の路線が1本のときに、合わせて出す路線の本数 */
export const MIN_DEFAULT_LINES = 3;
/** 足す路線を探す範囲（km） */
export const NEARBY_ROUTE_SEARCH_KM = 5;

interface StationLike { name: string; lat: number; lng: number }

export function defaultRoutesNear<S extends StationLike>(
  lat: number,
  lng: number,
  stations: S[],
  routesOf: (station: S) => RouteKey[],
): RouteKey[] {
  const byDistance = stations
    .map(s => ({ s, d: approxDistanceKm(lat, lng, s.lat, s.lng) }))
    .sort((a, b) => a.d - b.d);
  if (byDistance.length === 0) return [];
  const first = routesOf(byDistance[0].s);
  if (first.length !== 1) return first;

  const picked: RouteKey[] = [...first];
  for (const { s, d } of byDistance.slice(1)) {
    if (d > NEARBY_ROUTE_SEARCH_KM || picked.length >= MIN_DEFAULT_LINES) break;
    for (const r of routesOf(s)) {
      if (picked.length >= MIN_DEFAULT_LINES) break;
      if (!picked.includes(r)) picked.push(r);
    }
  }
  return picked;
}
