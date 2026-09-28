/**
 * 記事ページ（/articles/*）の構造化データの組み立て。
 *
 * 記事レイアウト（_ArticleLayout.astro）と、独自の head を持つ紹介記事
 * （flex-rail-map-introduction.astro）の両方から使う。以前は紹介記事だけ
 * canonical も構造化データも無かった（head を別に書いていて付け忘れた）。
 *
 * 存在しない値で埋めない:
 * - dateModified は出さない。記事本文は全記事ぶんが1ファイル（articleBodyI18n.ts）
 *   にあり、どの記事がいつ直されたかを確かめられないため。以前は公開日を
 *   そのまま入れていたが、それは「更新日」ではない
 * - 著者・発行者は実在するプロジェクト名（CLAUDE.md の著作権表記）だけを書く
 */
import { SITE_URL, SITE_NAME } from './seo';

const PROJECT_NAME = 'Flex Rail Map Project';

export interface ArticleSeoInput {
  title: string;
  description: string;
  keywords?: string;
  /** 本文に表示している公開日（YYYY-MM-DD） */
  publishedDate: string;
  canonicalUrl: string;
  /** サイト内パス（/icon_...png など） */
  ogImage: string;
}

export function articleJsonLd(a: ArticleSeoInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    keywords: a.keywords ?? undefined,
    datePublished: a.publishedDate,
    url: a.canonicalUrl,
    author: { '@type': 'Organization', name: PROJECT_NAME },
    publisher: {
      '@type': 'Organization',
      name: PROJECT_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}${a.ogImage}` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.canonicalUrl },
  };
}

/** パンくず: ホーム > 記事一覧（> 記事）。記事一覧ページでは article を省略する */
export function articleBreadcrumbJsonLd(article?: { title: string; canonicalUrl: string }) {
  const items = [
    { name: SITE_NAME, item: `${SITE_URL}/` },
    { name: '記事一覧', item: `${SITE_URL}/articles` },
    ...(article ? [{ name: article.title, item: article.canonicalUrl }] : []),
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.item })),
  };
}
