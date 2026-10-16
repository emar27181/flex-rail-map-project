/** 記事に埋め込む地図の初期表示。全記事・全言語共通で管理する。 */
import { routes } from '../data/routes';
import type { ArticleMapState } from '../data/articles/types';
import { fitMapView } from './fitMapView';

/**
 * モバイルの埋め込み枠を基準にした全路線表示。
 * 記事ごとに地図の中心座標・ズーム値を固定しない。
 */
export const ARTICLE_MAP_VIEWPORT = {
  width: 360,
  height: 300,
  padding: 0.18,
  minZoom: 2,
  maxZoom: 14,
} as const;

export function fitArticleRoutes(state: Pick<ArticleMapState, 'routes'>): {
  center: [number, number];
  zoom: number;
} | undefined {
  const points = state.routes?.flatMap(key => routes[key] ?? []) ?? [];
  if (points.length === 0) return undefined;
  return fitMapView(points, ARTICLE_MAP_VIEWPORT);
}
