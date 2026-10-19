/** 路線のページに掲載する関連記事。記事データの relatedRoutes だけを参照し、手作業のリンク表を持たない。 */
import type { RouteKey } from '../data/routes';
import { ARTICLE_SOURCES } from '../data/articles';
import { ARTICLE_PAGE_TRANSLATIONS, type ArticleLanguage } from '../data/articleI18n';
import { articlePath } from '../config/articleSeo';
import { withSiteName } from '../config/seo';

export interface RouteRelatedArticle {
  slug: string;
  title: string;
  href: string;
}

/** 路線だけを扱う記事を優先。元の記事順を維持する（安定ソート）。 */
export function articlesForRoute(route: RouteKey, lang: ArticleLanguage, limit = 3): RouteRelatedArticle[] {
  return ARTICLE_SOURCES
    .filter(article => article.relatedRoutes?.includes(route))
    .sort((a, b) => (a.relatedRoutes?.length ?? Infinity) - (b.relatedRoutes?.length ?? Infinity))
    .slice(0, Math.max(0, limit))
    .map(article => ({
      slug: article.slug,
      title: withSiteName(ARTICLE_PAGE_TRANSLATIONS[article.slug][lang].title),
      href: articlePath(article.slug, lang),
    }));
}
