/**
 * URLで指定された路線をすべて地図内に表示する共通の初期ビュー計算。
 * 記事・地図本体で同じルールを使う。個別記事に座標や倍率を持たせない。
 */
import { routes, type RouteKey } from '../data/routes';
import { fitMapView } from './fitMapView';

// 小さい埋め込み・スマホ表示を基準にする。地図外にはみ出さない程度に余白を抑える。
export const ROUTE_MAP_VIEWPORT = {
  width: 360,
  height: 300,
  padding: 0.08,
  minZoom: 3,
  maxZoom: 14,
} as const;

export function fitVisibleRoutes(routeKeys: readonly RouteKey[]): {
  center: [number, number];
  zoom: number;
} | undefined {
  const points = routeKeys.flatMap(key => routes[key] ?? [])
    .filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lng));
  return points.length ? fitMapView(points, ROUTE_MAP_VIEWPORT) : undefined;
}
