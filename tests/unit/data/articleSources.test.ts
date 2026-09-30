import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';
import { ARTICLE_SOURCES } from '../../../src/data/articles';
import { articleImagePath } from '../../../src/utils/articleRender';
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
      it('4言語とも、結論（3行）で始まり、見出しは3〜5個、地図の埋め込みと地図を開くボタンがある', () => {
        for (const lang of LANGS) {
          const blocks = a.content[lang].blocks;
          expect(blocks[0].type, lang).toBe('points');
          if (blocks[0].type === 'points') expect(blocks[0].items.length, lang).toBe(3);
          const h2 = blocks.filter(b => b.type === 'h2').length;
          expect(h2, lang).toBeGreaterThanOrEqual(3);
          expect(h2, lang).toBeLessThanOrEqual(5);
          expect(blocks.some(b => b.type === 'embed'), `${lang} embed`).toBe(true);
          expect(blocks[blocks.length - 1].type, `${lang} 最後は cta`).toBe('cta');
        }
      });

      it('ブロックの並び（種類）は4言語で同じ（一部の言語だけ図や見出しが抜けない）', () => {
        const shape = (lang: ArticleLang) => a.content[lang].blocks.map(b => b.type).join(',');
        for (const lang of LANGS) expect(shape(lang), lang).toBe(shape('ja'));
      });

      it('参照している地図の状態・画像が実在し、画像には代替テキストと説明がある', () => {
        for (const lang of LANGS) {
          for (const b of a.content[lang].blocks) {
            if (b.type === 'embed' || b.type === 'cta') expect(a.maps[b.map], `${lang} map ${b.map}`).toBeDefined();
            if (b.type === 'shot') {
              if (!b.article) expect(a.shots[b.shot], `${lang} shot ${b.shot}`).toBeDefined();
              expect(existsSync(join('public', articleImagePath(b.article ?? a.slug, b.shot, lang))), `${lang} ${b.shot} の画像`).toBe(true);
              expect(b.alt.trim(), `${lang} ${b.shot} alt`).not.toBe('');
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
