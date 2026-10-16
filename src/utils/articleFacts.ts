/**
 * 記事の文章に、路線データの値（駅番号・駅名の訳）をそのまま差し込む。
 *
 * 記事に駅番号を手で書くと、データと食い違う（2026-10: 記事は「東京は JY01」、地図は「JY24」だった）。
 * 生成 AI が書いた原稿でも、存在しない番号が紛れ込まないよう、駅番号は次の書き方で書き、
 * 描画するときにデータの値に置き換える。データに無い駅・番号を書くとビルドとテストが止まる。
 *
 *   {stationNumber:yamanote:渋谷}  → JY20（src/data/stationNumbers.ts の値）
 *   {station:yamanote:渋谷}        → 渋谷 / Shibuya / 涩谷 / 시부야（記事の言語の駅名。translation.ts の訳）
 *   {line:yamanote}                → 山手線 / Yamanote Line（記事の言語の路線名。駅・路線のページと同じ routeName）
 *
 * 駅は「路線キー:駅名」で指定する。駅名だけだと同じ名前の別の駅と区別できないため。
 */
import { routes, type RouteKey } from '../data/routes';
import { getStationNumber } from '../data/stationNumbers';
import { translateStation, type Language } from './translation';
import { routeName } from '../seo/pageModel';
import type { ArticleLang, ArticleStationRef } from '../data/articles/types';

const APP_LANG: Record<ArticleLang, Language> = { ja: 'japanese', en: 'english', zh: 'chinese', ko: 'korean' };

/** 差し込みの書き方（{種類:路線キー:駅名}） */
export const ARTICLE_TOKEN_RE = /\{(stationNumber|station):([A-Za-z0-9]+):([^{}:]+)\}/g;
/** 路線名の差し込み（{line:路線キー}） */
export const ARTICLE_LINE_TOKEN_RE = /\{line:([A-Za-z0-9]+)\}/g;

/** 路線データにあるその路線の駅（無ければ undefined） */
export function findArticleStation(ref: ArticleStationRef): { name: string; lat: number; lng: number } | undefined {
  const list = (routes as Record<string, Array<{ name: string; lat: number; lng: number }> | undefined>)[ref.route];
  return list?.find(s => s.name === ref.name);
}

/** 差し込みを値に置き換える。データに無い駅・番号は止める（推測の値を出さない） */
export function resolveArticleTokens(text: string, lang: ArticleLang, where = ''): string {
  return text.replace(ARTICLE_LINE_TOKEN_RE, (_m, route: string) => {
    if (!(route in routes)) throw new Error(`${where}: 路線 ${route} が路線データに無い（{line:${route}}）`);
    return routeName(route as RouteKey, lang);
  }).replace(ARTICLE_TOKEN_RE, (_m, kind: string, route: string, name: string) => {
    const ref = { route: route as RouteKey, name };
    if (!findArticleStation(ref)) throw new Error(`${where}: 路線 ${route} に駅「${name}」が無い（{${kind}:${route}:${name}}）`);
    if (kind === 'station') return translateStation(name, APP_LANG[lang]);
    const num = getStationNumber(ref.route, name);
    if (!num) throw new Error(`${where}: 路線 ${route} の「${name}」の駅番号がデータに無い（{${kind}:${route}:${name}}）`);
    return num;
  });
}
