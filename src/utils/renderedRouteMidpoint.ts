import type { LatLng, TrackGeometry } from '../data/trackGeometry/types';
import type { Point } from './routeOffset';

type StationPosition = { name: string; lat: number; lng: number };
export interface RenderedRouteSegment {
  stations: StationPosition[];
  positions: LatLng[];
  stationIndices: number[];
}

/** expandWithGeometryと同じ頂点の並びで、各駅の位置を特定する。 */
export function stationVertexIndices(stations: StationPosition[], geometry?: TrackGeometry): number[] {
  const sections = new Map<string, number>();
  geometry?.sections.forEach(s => {
    sections.set(`${s.from}\0${s.to}`, s.points.length);
    sections.set(`${s.to}\0${s.from}`, s.points.length);
  });
  let vertex = 0;
  return stations.map((station, i) => {
    if (i > 0) vertex += 1 + (sections.get(`${stations[i - 1].name}\0${station.name}`) ?? 0);
    return vertex;
  });
}

/** 投影後の線の長さを半分たどる。カーブもずらし済みの線も、必ず線上に載せる。 */
export function renderedRouteMidpoint(
  segments: RenderedRouteSegment[], from: StationPosition, to: StationPosition,
  project: (position: LatLng) => Point, unproject: (point: Point) => LatLng,
): LatLng | null {
  const matches = (a: StationPosition, b: StationPosition) => a.name === b.name && a.lat === b.lat && a.lng === b.lng;
  for (const segment of segments) {
    const a = segment.stations.findIndex(s => matches(s, from));
    const b = segment.stations.findIndex(s => matches(s, to));
    if (a < 0 || b < 0) continue;
    const points = segment.positions.slice(
      segment.stationIndices[Math.min(a, b)], segment.stationIndices[Math.max(a, b)] + 1,
    ).map(project);
    if (points.length === 0) return null;
    const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
    let remaining = lengths.reduce((sum, length) => sum + length, 0) / 2;
    for (let i = 0; i < lengths.length; i++) {
      if (lengths[i] === 0) continue;
      if (remaining <= lengths[i]) {
        const ratio = remaining / lengths[i];
        return unproject({ x: points[i].x + (points[i + 1].x - points[i].x) * ratio,
          y: points[i].y + (points[i + 1].y - points[i].y) * ratio });
      }
      remaining -= lengths[i];
    }
    return unproject(points[points.length - 1]);
  }
  // 別々の描画区間を結ぶラベルは出さない。
  return null;
}
