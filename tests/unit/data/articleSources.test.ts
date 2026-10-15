import { describe, it, expect } from 'vitest';
import { ARTICLE_SOURCES } from '../../../src/data/articles';
import { articleBlocksForRender, articleMapHref, shotEmbedSrc, renderArticleBody } from '../../../src/utils/articleRender';
import { getRouteCode } from '../../../src/utils/routeUrlCodes';
import { findArticleStation, ARTICLE_TOKEN_RE, ARTICLE_LINE_TOKEN_RE } from '../../../src/utils/articleFacts';
import { encodeStationParam } from '../../../src/utils/stationUrlParams';
import { routes } from '../../../src/data/routes';
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


      it('記事内の地図URLも駅名を英語slugで出し、日本語のパーセントエンコードを出さない', () => {
        for (const state of Object.values(a.maps)) {
          if (!state.from && !state.to) continue;
          const href = articleMapHref(state, 'ja');
          expect(href).not.toMatch(/%E[0-9A-F]{1}/i);
          if (state.from) expect(href).not.toContain(encodeURIComponent(state.from));
          if (state.to) expect(href).not.toContain(encodeURIComponent(state.to));
        }
      });

      it('地図の focus・関連する路線と駅は路線データにあり、駅は路線と組で実在する（同名の別駅を取り違えない）', () => {
        const states = [...Object.values(a.maps), ...Object.values(a.shots).map(sh => sh.map).filter(m => m && typeof m !== 'string')];
        for (const m of states) {
          if (!m || typeof m === 'string') continue;
          if (m.focus) expect(findArticleStation(m.focus), `focus ${m.focus.route}:${m.focus.name}`).toBeDefined();
          for (const st of [m.from, m.to]) if (st) expect(encodeStationParam(st), `駅 ${st} を地図が引けない`).toBeTruthy();
          if (m.zoom !== undefined) expect(m.zoom, 'zoom').toBeGreaterThanOrEqual(5);
          if (m.zoom !== undefined) expect(m.zoom, 'zoom').toBeLessThanOrEqual(18);
        }
        for (const r of a.relatedRoutes ?? []) expect(r in routes, `relatedRoutes ${r}`).toBe(true);
        for (const st of a.relatedStations ?? []) expect(findArticleStation(st), `relatedStations ${st.route}:${st.name}`).toBeDefined();
      });

      it('出典は https の URL・題名・発行元・確認日がそろう。駅番号を差し込む記事は出典が必須', () => {
        for (const src of a.sources ?? []) {
          expect(src.url, src.title).toMatch(/^https:\/\/[^\s]+$/);
          expect(src.title.trim()).not.toBe('');
          expect(src.publisher.trim()).not.toBe('');
          expect(src.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
        const usesNumbers = JSON.stringify(a.content).includes('{stationNumber:');
        if (usesNumbers) expect((a.sources ?? []).length, '駅番号を書いた記事に出典が無い').toBeGreaterThan(0);
      });

      it('4言語とも描画でき（差し込みがすべて路線データの値になる）、本文に差し込みの書き方が残らない', () => {
        for (const lang of LANGS) {
          const html = renderArticleBody(a, lang);
          expect(html, lang).not.toMatch(new RegExp(ARTICLE_TOKEN_RE.source));
          expect(html, lang).not.toMatch(new RegExp(ARTICLE_LINE_TOKEN_RE.source));
        }
      });

      it('タイトル・説明には差し込みを使わない（検索結果に出る文はそのまま書く）', () => {
        for (const lang of LANGS) {
          const meta = JSON.stringify(a.content[lang].meta);
          expect(meta, lang).not.toMatch(/\{(stationNumber|station|line):/);
        }
      });

      it('駅番号を見せる地図は URL に numbers=1 が付く（日本語の地図は既定で番号を出さないため）', () => {
        for (const m of Object.values(a.maps)) {
          if (m.stationNumbers) expect(articleMapHref(m, 'ja', true)).toContain('numbers=1');
        }
      });

      it('関連記事は3本で、実在する別の記事', () => {
        expect(a.related).toHaveLength(3);
        for (const r of a.related) {
          expect(r).not.toBe(a.slug);
          expect(ARTICLE_SOURCES.some(x => x.slug === r), r).toBe(true);
        }
      });

      it('ひな形の書きかけ（〇〇）が残っていない', () => {
        expect(JSON.stringify(a)).not.toContain('〇〇');
      });

      it('サービス名を直書きしない（{siteName} と書く）', () => {
        const text = JSON.stringify(a.content);
        expect(text).not.toMatch(/Flex Rail(way)? Map|フレックス路線図/);
      });
    });
  }
});

describe('埋め込みで記事のページが途中まで動かない', () => {
  it('埋め込む画面の URL に #（節の位置）を付けない（?section= で中だけをスクロールする）', () => {
    for (const a of ARTICLE_SOURCES) {
      for (const lang of LANGS) {
        for (const spec of Object.values(a.shots ?? {})) {
          const src = shotEmbedSrc(spec, a, lang);
          expect(src, `${a.slug} ${lang}`).not.toContain('#');
        }
      }
    }
  });

  it('同じ画面を1つの記事で2回埋め込まない（冒頭のデモと同じ地図を本文でも出さない）', () => {
    for (const a of ARTICLE_SOURCES) {
      for (const lang of LANGS) {
        const html = renderArticleBody(a, lang);
        const srcs = [...html.matchAll(/<iframe[^>]*\ssrc="([^"]+)"/g)].map(m => m[1]);
        expect(new Set(srcs).size, `${a.slug} ${lang}`).toBe(srcs.length);
      }
    }
  });
});
