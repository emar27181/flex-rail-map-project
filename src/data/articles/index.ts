/**
 * 記事の一覧（並び順＝記事一覧ページの順）。
 * 記事を足すときは、{slug}.ts を作ってここに1行足す（手順は docs/article-writing.md）。
 */
import type { ArticleSource } from './types';
import { tokyoRentByRoute } from './tokyo-rent-by-route';
import { flexRailMapIntroduction } from './flex-rail-map-introduction';
import { tokyoTrainMapBeginner } from './tokyo-train-map-beginner';
import { tokyoSightseeingRoutes } from './tokyo-sightseeing-routes';
import { commute30minCheapRent } from './commute-30min-cheap-rent';
import { tokyoSafeAreaByRoute } from './tokyo-safe-area-by-route';

export const ARTICLE_SOURCES: ArticleSource[] = [
  tokyoRentByRoute,
  flexRailMapIntroduction,
  tokyoTrainMapBeginner,
  tokyoSightseeingRoutes,
  commute30minCheapRent,
  tokyoSafeAreaByRoute,
];
