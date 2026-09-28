/*
 * 【必読】編集する前に docs/seo.md の「駅・路線・データのページ」を読むこと（確認は npm run build）。
 */
/**
 * 検索向けに自動生成するページ（/lines/*, /stations/*, /data/*）の範囲と、
 * index させるかどうかの基準。ページの中身はすべて路線データ・駅統計から
 * 自動で作る（src/seo/pageModel.ts）。ここに書くのは「どこまで作るか」だけ。
 *
 * - 路線を足せば、その路線の全駅の駅ページも自動でできる
 * - 情報量が基準に届かないページは作るが noindex にし、sitemap にも載せない
 *   （何千もの薄いページを検索エンジンに出さないため）
 * - 推定値（stationStats.ts の dataQuality: 'estimated'）の指標はページを作らない
 */
import type { RouteKey } from './routes';
import type { StationStats } from './stationStats';

/** 路線ページを作る路線（首都圏の主要路線から始める PoC） */
export const SEO_LINE_KEYS: RouteKey[] = [
  'yamanote',
  'chuo',
  'keihinTohoku',
  'jrSobuLine',
  'jrSaikyoLine',
  'jrKeiyo',
  'ginzaLine',
  'marunouchiLine',
  'hibiyaLine',
  'tozaiLine',
  'chiyodaLine',
  'yurakuchoLine',
  'hanzomonLine',
  'nambokuLine',
  'fukutoshinLine',
  'toeiAsakusaLine',
  'toeiOedoLine',
  'tokyuToyokoLine',
  'odakyuLine',
  'keikyuLine',
];

/**
 * 駅ページの段階（Tier）の基準。
 * - A: 実データの周辺統計が minRealStats 項目以上あり、かつ
 *      「大きな乗換駅（実質の路線数が minLines 以上）」または「観光地の最寄り駅」。
 *      → index（sitemap に載る）
 *      首都圏の対象駅はほぼ全駅に OSM の周辺統計（11項目以上）があるため、
 *      実際に差が付くのは路線数。3路線だと64駅になり、同じ型のページを一度に
 *      出しすぎるので、PoC では5路線以上（＋観光地の最寄り駅）の約26駅に絞る
 * - B: 乗換駅、または周辺統計がある駅 → noindex, follow
 * - C: それ以外（駅名・路線・隣の駅しか書けない）→ noindex, follow
 */
export const STATION_TIER_RULES = {
  minLines: 5,
  minRealStats: 5,
};

/** データのページ（/data/{slug}）。推定値の指標は自動で除外される */
export interface SeoDataMetric {
  slug: string;
  statKey: keyof StationStats;
}

export const SEO_DATA_METRICS: SeoDataMetric[] = [
  { slug: 'restaurant-count', statKey: 'restaurantCount' },
  // 乗降客数・家賃は現状すべて推定値のためページを作らない（実データに置き換えたら自動で作られる）
  { slug: 'passengers', statKey: 'dailyPassengers' },
  { slug: 'rent', statKey: 'avgRent1K' },
];

/** データのページを index させるのに必要な、値のある駅の数 */
export const MIN_STATIONS_FOR_DATA_PAGE = 20;
