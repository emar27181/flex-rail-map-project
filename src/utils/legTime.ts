/**
 * 路線データの駅列で、2駅間の所要時間（分）。
 *
 * 経路検索（routeFinder.ts）と直通運転の経路（throughRouting.ts）で同じ計算を使う。
 * timeToNext が無い駅間は3分とみなす（経路検索の従来の扱い）。
 */
import type { Station } from '../data/yamanote';

/** timeToNext が無い駅間の所要時間（分） */
export const DEFAULT_TIME_TO_NEXT = 3;

export function legTime(stations: Station[], fromIndex: number, toIndex: number): number {
  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);
  let total = 0;
  for (let i = start; i < end; i++) total += stations[i].timeToNext || DEFAULT_TIME_TO_NEXT;
  return total;
}
