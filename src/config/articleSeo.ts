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
import { PROJECT_NAME, SITE_URL, SITE_NAME, buildBreadcrumbJsonLd, hreflangCode } from './seo';
import type { ArticleLanguage } from '../data/articleI18n';

/** 記事一覧のパス（日本語は /articles、他の言語は /{lang}/articles） */
export function articleIndexPath(lang: ArticleLanguage): string {
  return lang === 'ja' ? '/articles' : `/${lang}/articles`;
}

/** 記事のパス */
export function articlePath(slug: string, lang: ArticleLanguage): string {
  return `${articleIndexPath(lang)}/${slug}`;
}


export interface ArticleSeoInput {
  title: string;
  description: string;
  keywords?: string;
  /** 本文に表示している公開日（YYYY-MM-DD） */
  publishedDate: string;
  /** 本文に表示している更新日（記事ごとに明示したときだけ。無ければ dateModified を出さない） */
  modifiedDate?: string;
  canonicalUrl: string;
  /** サイト内パス（/icon_...png など） */
  ogImage: string;
  /** 記事の言語 */
  lang?: ArticleLanguage;
}

export function articleJsonLd(a: ArticleSeoInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    keywords: a.keywords ?? undefined,
    datePublished: a.publishedDate,
    ...(a.modifiedDate ? { dateModified: a.modifiedDate } : {}),
    url: a.canonicalUrl,
    ...(a.lang ? { inLanguage: hreflangCode(a.lang) } : {}),
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
export function articleBreadcrumbJsonLd(
  article?: { title: string; canonicalUrl: string },
  index: { name: string; path: string } = { name: '記事一覧', path: '/articles' },
) {
  return buildBreadcrumbJsonLd([
    { name: SITE_NAME, path: '/' },
    index,
    ...(article ? [{ name: article.title, path: article.canonicalUrl.replace(SITE_URL, '') }] : []),
  ]);
}
