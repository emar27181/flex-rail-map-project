/**
 * 直通運転の区間（ThroughSection）を路線データの添字の範囲に直す。
 * throughService.ts（1本で行ける範囲）と throughRouting.ts（経路検索）の両方が使う。
 */
import { routes, type RouteKey } from '../data/routes';
import type { ThroughSection } from '../data/throughServices';
import type { Station } from '../data/yamanote';

export type RouteStations = Partial<Record<RouteKey, Station[]>>;

/** 区間の駅の添字範囲 [start, end]。駅名が路線に無ければ null */
export function resolveSectionRange(
  section: ThroughSection,
  routeStations: RouteStations = routes,
): [number, number] | null {
  const stations = routeStations[section.route];
  if (!stations || stations.length === 0) return null;
  const from = section.from === undefined ? 0 : stations.findIndex(s => s.name === section.from);
  const to = section.to === undefined ? stations.length - 1 : stations.findIndex(s => s.name === section.to);
  if (from < 0 || to < 0) return null;
  return [Math.min(from, to), Math.max(from, to)];
}
