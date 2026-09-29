/**
 * 記事の本文（HTML）。中身は src/data/articles/{slug}.ts のブロックで書き、
 * ここでは src/utils/articleRender.ts で HTML にするだけ（本文をここに直接書かない）。
 */
import type { ArticleLanguage } from './articleI18n';
import { ARTICLE_SOURCES } from './articles';
import { renderArticleBody } from '../utils/articleRender';

type ArticleBodyTranslations = Record<string, Record<ArticleLanguage, string>>;

export const ARTICLE_BODY_TRANSLATIONS: ArticleBodyTranslations = Object.fromEntries(
  ARTICLE_SOURCES.map(a => [a.slug, {
    ja: renderArticleBody(a, 'ja'),
    en: renderArticleBody(a, 'en'),
    zh: renderArticleBody(a, 'zh'),
    ko: renderArticleBody(a, 'ko'),
  }]),
);
