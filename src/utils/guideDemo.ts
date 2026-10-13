/**
 * ガイド（/guides/*）の冒頭に置く地図デモの URL。
 *
 * 記事と同じく「結論（検索意図への答え）→ 実際に触れる地図 → 詳しい説明」の順にする。
 * 以前のガイドは「地図を開く」ボタンだけで、ページの中で地図を触れなかった。
 * 表示する路線は、ガイドの CTA と同じ路線（無ければ最初の節の CTA の路線）。範囲はその路線全体が収まる位置。
 */
import { routes, type RouteKey } from '../data/routes';
import type { GuideDefinition } from '../data/guides';
import { buildMapHref } from './mapDeepLink';
import { fitMapView } from './fitMapView';
import { approxDistanceKm } from './sameStation';

/** 路線の指定がまったく無いガイドで使う路線（東京の路線図の入口になる山手線） */
export const GUIDE_DEMO_FALLBACK_ROUTES: RouteKey[] = ['yamanote'];

export function guideDemoRoutes(guide: GuideDefinition): RouteKey[] {
  const fromSections = guide.sections.find(s => s.cta?.routes?.length)?.cta?.routes;
  const picked = guide.ctaRoutes?.length ? guide.ctaRoutes : fromSections?.length ? fromSections : GUIDE_DEMO_FALLBACK_ROUTES;
  return picked.filter(rk => (routes[rk]?.length ?? 0) > 0);
}

/**
 * 都市のガイドで、表示範囲に入れる駅の中心からの距離（km）。
 * 路線全体に合わせると、京都なら京阪本線の大阪側・JR奈良線の奈良まで入って街が小さくなるため、
 * 駅の中央値の地点から近い駅だけで範囲を決める（路線そのものは全区間を表示する）
 */
export const GUIDE_DEMO_CITY_RADIUS_KM = 8;

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

/** 表示範囲を決める駅。都市のガイドは街の中心付近だけ、それ以外（路線のガイド）は路線全体 */
export function guideDemoFitStations(guide: GuideDefinition): { lat: number; lng: number }[] {
  const stations = guideDemoRoutes(guide).flatMap(rk => routes[rk] ?? []);
  if (!guide.city || stations.length === 0) return stations;
  const lat = median(stations.map(s => s.lat));
  const lng = median(stations.map(s => s.lng));
  const near = stations.filter(s => approxDistanceKm(s.lat, s.lng, lat, lng) <= GUIDE_DEMO_CITY_RADIUS_KM);
  return near.length >= 2 ? near : stations;
}

export function guideDemoSrc(guide: GuideDefinition): string {
  const keys = guideDemoRoutes(guide);
  const view = fitMapView(guideDemoFitStations(guide), { width: 720, height: 440 });
  return buildMapHref({ routes: keys, ...view, lang: guide.lang, embed: true });
}
