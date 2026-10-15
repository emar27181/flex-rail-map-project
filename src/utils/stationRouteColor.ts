import { Color } from 'three';
import type { RouteKey } from '../data/routes';

/** Same line-color source used for both the station's 3D marker and its name badge.
 * Color() defaults to WHITE in Three.js: adding route colors to it produces
 * washed-out grey/white markers. Start at black (zero) before averaging. */
export function averageStationRouteColor(
  routeKeys: readonly RouteKey[],
  colorOf: (key: RouteKey) => string,
): Color {
  const color = new Color(0);
  if (routeKeys.length === 0) return color;
  for (const key of routeKeys) color.add(new Color(colorOf(key)));
  return color.multiplyScalar(1 / routeKeys.length);
}
