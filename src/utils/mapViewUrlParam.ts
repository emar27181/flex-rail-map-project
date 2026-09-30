/**
 * 地図の表示位置を URL で指定する（`?center=35.681,139.767&zoom=13`）。
 *
 * 記事のスクリーンショットや「この範囲を見て」という共有リンクのために、開いたときの
 * 中心と拡大率を決められるようにする。開いたときに1回だけ読む（地図を動かすたびに
 * URL を書き換えると履歴・共有URLが落ち着かないため、書き戻しはしない）。
 * 指定があるときは、現在地への自動移動をしない（指定した範囲を見せるため）。
 */
export const MAP_CENTER_PARAM = 'center';
export const MAP_ZOOM_PARAM = 'zoom';
const MIN_ZOOM = 3;
const MAX_ZOOM = 19;

export interface MapView { center: [number, number]; zoom?: number }

/** URL の値から表示位置を読む。不正な値は無視する */
export function parseMapView(center: string | null | undefined, zoom: string | null | undefined): MapView | null {
  if (!center) return null;
  const [lat, lng] = center.split(',').map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  const z = zoom == null ? undefined : Number(zoom);
  return { center: [lat, lng], zoom: z !== undefined && Number.isFinite(z) && z >= MIN_ZOOM && z <= MAX_ZOOM ? z : undefined };
}

export function getInitialMapViewFromUrl(): MapView | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return parseMapView(params.get(MAP_CENTER_PARAM), params.get(MAP_ZOOM_PARAM));
  } catch {
    return null;
  }
}
