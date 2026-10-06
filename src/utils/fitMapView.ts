/**
 * 点の集まり（路線の駅など）がちょうど収まる地図の中心と拡大率を求める。
 * 駅・路線のページに埋め込む地図を、その路線全体が見える範囲で開くために使う。
 * 拡大率は Leaflet と同じ Web メルカトル（256px タイル）で計算する。
 */
export interface FitOptions {
  /** 地図の枠の大きさ（px） */
  width: number;
  height: number;
  /** 枠の内側に残す余白の割合（0.15 なら各辺 15%） */
  padding?: number;
  minZoom?: number;
  maxZoom?: number;
}

const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

export function fitMapView(points: Array<{ lat: number; lng: number }>, opts: FitOptions): { center: [number, number]; zoom: number } {
  const { width, height, padding = 0.15, minZoom = 8, maxZoom = 14 } = opts;
  const lats = points.map(p => p.lat), lngs = points.map(p => p.lng);
  const [s, n] = [Math.min(...lats), Math.max(...lats)];
  const [w, e] = [Math.min(...lngs), Math.max(...lngs)];
  const center: [number, number] = [Math.round(((s + n) / 2) * 1e4) / 1e4, Math.round(((w + e) / 2) * 1e4) / 1e4];
  const usableW = width * (1 - padding * 2), usableH = height * (1 - padding * 2);
  const zx = Math.log2((usableW * 360) / (256 * Math.max(e - w, 1e-6)));
  const zy = Math.log2((usableH * 2 * Math.PI) / (256 * Math.max(mercY(n) - mercY(s), 1e-9)));
  const zoom = Math.max(minZoom, Math.min(maxZoom, Math.floor(Math.min(zx, zy))));
  return { center, zoom };
}
