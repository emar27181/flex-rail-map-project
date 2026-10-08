import { describe, it, expect } from 'vitest';
import { ARTICLE_SOURCES } from '../../../src/data/articles';
import { articleBlocksForRender, shotEmbedSrc } from '../../../src/utils/articleRender';
import { getRouteCode } from '../../../src/utils/routeUrlCodes';
import { isUrlHeatmapMetric } from '../../../src/utils/heatmapUrlParam';
import type { ArticleLang } from '../../../src/data/articles/types';

/**
 * 記事のデータ（src/data/articles/{slug}.ts）の形の決まり（docs/article-writing.md）。
 * ほかの AI が記事を足したときに、決まりから外れたものをここで止める。
 */
const LANGS: ArticleLang[] = ['ja', 'en', 'zh', 'ko'];

describe('記事のデータ', () => {
  it('slug はファイル名に使える形で、重複しない', () => {
    const slugs = ARTICLE_SOURCES.map(a => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  for (const a of ARTICLE_SOURCES) {
    describe(a.slug, () => {
      it('4言語とも、結論（3行）→地図デモ→詳しい説明の順で、最後は地図を開くボタン', () => {
        for (const lang of LANGS) {
          const blocks = a.content[lang].blocks;
          expect(blocks[0].type, lang).toBe('points');
          if (blocks[0].type === 'points') expect(blocks[0].items.length, lang).toBe(3);
          const h2 = blocks.filter(b => b.type === 'h2').length;
          expect(h2, lang).toBeGreaterThanOrEqual(3);
          expect(h2, lang).toBeLessThanOrEqual(5);
          expect(blocks.some(b => b.type === 'embed'), `${lang} embed`).toBe(true);
          expect(blocks[blocks.length - 1].type, `${lang} 最後は cta`).toBe('cta');

          const rendered = articleBlocksForRender(a, lang);
          expect(rendered[0].type, `${lang} 先頭は結論`).toBe('points');
          expect(rendered[1].type, `${lang} 結論直後は地図デモ`).toBe('embed');
          expect(rendered.findIndex(b => b.type === 'h2'), `${lang} 説明はデモの後`).toBeGreaterThan(1);
        }
      });

      it('ブロックの並び（種類）は4言語で同じ（一部の言語だけ図や見出しが抜けない）', () => {
        const shape = (lang: ArticleLang) => a.content[lang].blocks.map(b => b.type).join(',');
        for (const lang of LANGS) expect(shape(lang), lang).toBe(shape('ja'));
      });

      it('参照している地図の状態・画面が実在し、埋め込みには title と説明がある', () => {
        for (const lang of LANGS) {
          for (const b of a.content[lang].blocks) {
            if (b.type === 'embed' || b.type === 'cta') expect(a.maps[b.map], `${lang} map ${b.map}`).toBeDefined();
            if (b.type === 'shot') {
              const owner = b.article ? ARTICLE_SOURCES.find(x => x.slug === b.article) : a;
              const spec = owner?.shots[b.shot];
              expect(spec, `${lang} shot ${b.shot}`).toBeDefined();
              // 埋め込む URL はその言語で開く（地図は埋め込み表示）
              const src = shotEmbedSrc(spec!, owner!, lang);
              if (spec!.page) expect(src.startsWith(lang === 'ja' ? '/' : `/${lang}/`), src).toBe(true);
              else expect(src, src).toMatch(new RegExp(`[?&]lang=${lang}(&|$).*embed=1|embed=1.*[?&]lang=${lang}`));
              expect(b.alt.trim(), `${lang} ${b.shot} の title`).not.toBe('');
              expect(b.caption.trim(), `${lang} ${b.shot} caption`).not.toBe('');
            }
          }
        }
      });

      it('地図の状態の路線・指標は地図側が読めるものだけ', () => {
        const states = [...Object.values(a.maps), ...Object.values(a.shots).map(s => s.map).filter(m => m && typeof m !== 'string')];
        for (const m of states) {
          if (!m || typeof m === 'string') continue;
          for (const r of m.routes ?? []) expect(getRouteCode(r), r).toBeTruthy();
          if (m.metric) expect(isUrlHeatmapMetric(m.metric), m.metric).toBe(true);
        }
      });

      it('関連記事は3本で、実在する別の記事', () => {
        expect(a.related).toHaveLength(3);
        for (const r of a.related) {
          expect(r).not.toBe(a.slug);
          expect(ARTICLE_SOURCES.some(x => x.slug === r), r).toBe(true);
        }
      });

      it('サービス名を直書きしない（{siteName} と書く）', () => {
        const text = JSON.stringify(a.content);
        expect(text).not.toMatch(/Flex Rail(way)? Map|フレックス路線図/);
      });
    });
  }
});
