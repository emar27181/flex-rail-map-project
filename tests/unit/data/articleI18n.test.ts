import { describe, it, expect } from 'vitest';
import { ARTICLES, ARTICLE_LANGUAGES, ARTICLE_PAGE_TRANSLATIONS } from '../../../src/data/articleI18n';
import { ARTICLE_BODY_TRANSLATIONS } from '../../../src/data/articleBodyI18n';

describe('記事の多言語版', () => {
  it('すべての記事に4言語のタイトル・説明・本文がある（言語ごとに別URLで出すため）', () => {
    for (const a of ARTICLES) {
      for (const lang of ARTICLE_LANGUAGES) {
        const meta = ARTICLE_PAGE_TRANSLATIONS[a.slug]?.[lang];
        expect(meta?.title, `${a.slug} ${lang} title`).toBeTruthy();
        expect(meta?.description, `${a.slug} ${lang} description`).toBeTruthy();
        expect(ARTICLE_BODY_TRANSLATIONS[a.slug]?.[lang]?.trim(), `${a.slug} ${lang} body`).toBeTruthy();
      }
    }
    for (const lang of ARTICLE_LANGUAGES) expect(ARTICLE_PAGE_TRANSLATIONS.articles[lang].title).toBeTruthy();
  });

  it('本文の記事リンクは同じ言語の記事URLを指し、旧URL（?lang=）を使わない', () => {
    for (const [slug, bodies] of Object.entries(ARTICLE_BODY_TRANSLATIONS)) {
      for (const lang of ARTICLE_LANGUAGES) {
        const hrefs = [...(bodies[lang] ?? '').matchAll(/href="([^"]+)"/g)].map(m => m[1]);
        for (const href of hrefs.filter(h => h.includes('/articles'))) {
          expect(href, `${slug} ${lang}`).not.toContain('?lang=');
          const prefix = lang === 'ja' ? '/articles/' : `/${lang}/articles/`;
          expect(href.startsWith(prefix), `${slug} ${lang}: ${href}`).toBe(true);
          const target = href.slice(prefix.length).split(/[?#]/)[0];
          expect(ARTICLES.some(a => a.slug === target), `${slug} ${lang}: ${href}`).toBe(true);
        }
        // 地図へのリンクはその言語で開く（日本語は既定なので付けない）
        for (const href of hrefs.filter(h => h === '/' || h.startsWith('/?'))) {
          expect(href, `${slug} ${lang}`).toBe(lang === 'ja' ? '/' : `/?lang=${lang}`);
        }
      }
    }
  });

  it('本文の図・表の数は言語ごとにそろっている（一部の言語だけ図が抜けていない）', () => {
    for (const [slug, bodies] of Object.entries(ARTICLE_BODY_TRANSLATIONS)) {
      const figures = ARTICLE_LANGUAGES.map(l => (bodies[l]?.match(/<figure/g) ?? []).length);
      const headings = ARTICLE_LANGUAGES.map(l => (bodies[l]?.match(/<h2/g) ?? []).length);
      expect(new Set(figures).size, `${slug} figures ${figures}`).toBe(1);
      expect(new Set(headings).size, `${slug} h2 ${headings}`).toBe(1);
    }
  });

  it('日本語・中国語・韓国語版の見出し・タグに英語の飾り文字を残さない（言語が混ざって見える）', () => {
    for (const [key, byLang] of Object.entries(ARTICLE_PAGE_TRANSLATIONS)) {
      for (const lang of ['ja', 'zh', 'ko'] as const) {
        const meta = byLang[lang];
        for (const field of ['tag', 'kicker', 'category', 'title'] as const) {
          expect(meta[field], `${key} ${lang} ${field}`).not.toMatch(/^[A-Za-z][A-Za-z /]+$/);
        }
      }
    }
    for (const [slug, bodies] of Object.entries(ARTICLE_BODY_TRANSLATIONS)) {
      for (const lang of ['ja', 'zh', 'ko'] as const) expect(bodies[lang], `${slug} ${lang}`).not.toContain('Try it now');
    }
  });
});
