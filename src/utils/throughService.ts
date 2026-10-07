/**
 * 直通運転（src/data/throughServices.ts）から、ある駅から乗り換えなしで
 * 行ける他路線の区間を求める。
 */
import { routes, type RouteKey } from '../data/routes';
import { THROUGH_SERVICES, type ThroughService } from '../data/throughServices';
import type { Station } from '../data/yamanote';
import { isSameStation, type StationRef } from './sameStation';
import { resolveSectionRange, type RouteStations } from './throughSection';
import { resolveServices } from './throughRouting';

export { resolveSectionRange } from './throughSection';

/** 重なる・隣接する範囲をまとめる（同じ路線を複数の系統から指したときの二重描画防止） */
function mergeRanges(ranges: [number, number][]): [number, number][] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else out.push([r[0], r[1]]);
  }
  return out;
}

/**
 * origin から直通列車1本で行ける、他路線の区間。
 *
 * origin 自体が通る路線は地図上で全区間を出すので結果に含めない。
 * 返り値は路線ごとの駅列（連続しない区間は別要素）。
 *
 * origin は座標付きで渡すこと。全国の系統を登録しているため、名前だけだと
 * 京都の「大宮」から首都圏の湘南新宿ラインに乗れることになってしまう
 * （名前だけの文字列も受け付けるが、そのときは同名別駅を区別できない）。
 */
export function getThroughReachableSections(
  origin: StationRef | string,
  services: ThroughService[] = THROUGH_SERVICES,
  routeStations: RouteStations = routes,
): Map<RouteKey, Station[][]> {
  const ref: StationRef = typeof origin === 'string' ? { name: origin } : origin;
  const isOrigin = (s: Station) => isSameStation(s, ref);

  const ownRoutes = new Set(
    (Object.keys(routeStations) as RouteKey[]).filter(rk => routeStations[rk]?.some(isOrigin)),
  );

  const rangesByRoute = new Map<RouteKey, [number, number][]>();
  const add = (rk: RouteKey, range: [number, number]) => {
    if (ownRoutes.has(rk)) return;
    const list = rangesByRoute.get(rk) ?? [];
    list.push(range);
    rangesByRoute.set(rk, list);
  };
  const resolved = resolveServices(services, routeStations);
  services.forEach((service, si) => {
    const resolvedSections = service.sections.map(sec => ({ sec, range: resolveSectionRange(sec, routeStations) }));
    const boards = resolvedSections.some(({ sec, range }) =>
      range !== null &&
      routeStations[sec.route]!.slice(range[0], range[1] + 1).some(isOrigin),
    );
    if (!boards) return;
    for (const { sec, range } of resolvedSections) {
      if (range) add(sec.route, range);
    }
    // 路線データに間の線が無い直通（東海道線の東京〜宇都宮線の上野）は、橋渡しの区間も描いて線をつなぐ
    for (const link of resolved[si].links.values()) {
      if (link.kind === 'bridge') add(link.via, [Math.min(link.viaFrom, link.viaTo), Math.max(link.viaFrom, link.viaTo)]);
    }
  });

  const result = new Map<RouteKey, Station[][]>();
  for (const [rk, ranges] of rangesByRoute) {
    const stations = routeStations[rk]!;
    result.set(rk, mergeRanges(ranges).map(([a, b]) => stations.slice(a, b + 1)));
  }
  return result;
}
