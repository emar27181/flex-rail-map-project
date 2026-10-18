import type { ArticleLanguage } from './articleI18n';
import { ARTICLES } from './articleI18n';
/** 編集上の推奨順。アクセス数等の実測ランキングではない。 */
export const ARTICLE_INDEX_GROUPS = [
  { id: 'getting-started', labels: { ja: '使い方・鉄道の基本', en: 'How to use trains', zh: '使用方法与铁路基础', ko: '이용 가이드·철도 기초' },
    picks: ['flex-rail-map-introduction','tokyo-train-map-beginner','how-to-read-station-numbers'],
    matches: /station-number|train-map-beginner|flex-rail-map-introduction|express-vs-local|through-service|station-exit|tokyo-metro-line-letters/i },
  { id: 'sightseeing', labels: { ja: '観光・お出かけ', en: 'Sightseeing and trips', zh: '观光与出行', ko: '관광·나들이' },
    picks: ['asakusa-skytree-stations','tokyo-sightseeing-routes','kamakura-enoden-stations'],
    matches: /asakusa|sightseeing|enoshima|kamakura|disneyland|nikko|hakone|fujikyu|odaiba|kawagoe|shibuya-harajuku/i },
  { id: 'stations-airports', labels: { ja: '主要駅・空港・地域別路線', en: 'Stations, airports and regional lines', zh: '主要车站、机场及地方线路', ko: '주요 역·공항·지역 노선' },
    picks: ['narita-jr-keisei-map','haneda-keikyu-monorail-map','shinjuku-station-line-first'],
    matches: /station|airport|kyoto|osaka|sapporo|nagoya|sendai|fukuoka|yokohama|shinjuku|akihabara|ueno/i },
  { id: 'living', labels: { ja: '暮らし・通勤・沿線選び', en: 'Living and commuting', zh: '生活、通勤与选线', ko: '생활·통근·노선 선택' },
    picks: ['tokyo-rent-by-route','commute-30min-cheap-rent','tokyo-safe-area-by-route'],
    matches: /rent|commute|safe-area/i },
] as const;
export type ArticleIndexGroup = typeof ARTICLE_INDEX_GROUPS[number];
export function groupedArticles() {
  const result = new Map<string, typeof ARTICLES>();
  ARTICLE_INDEX_GROUPS.forEach(g => result.set(g.id, []));
  const fallback = ARTICLE_INDEX_GROUPS[2];
  ARTICLES.forEach(a => {
    const group = ARTICLE_INDEX_GROUPS.find(g => g.picks.some(s => s === a.slug))
      ?? ARTICLE_INDEX_GROUPS.find(g => g.matches.test(a.slug))
      ?? fallback;
    result.get(group.id)?.push(a);
  });
  ARTICLE_INDEX_GROUPS.forEach(g => {
    const items = result.get(g.id) ?? [];
    items.sort((a,b) => {
      const ai = g.picks.findIndex(s => s === a.slug);
      const bi = g.picks.findIndex(s => s === b.slug);
      return (ai < 0 ? Infinity : ai) - (bi < 0 ? Infinity : bi);
    });
  });
  return ARTICLE_INDEX_GROUPS.map(g => ({ ...g, title: (lang: ArticleLanguage) => g.labels[lang], articles: result.get(g.id) ?? [] }));
}
