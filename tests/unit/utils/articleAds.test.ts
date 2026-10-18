import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ARTICLE_SOURCES } from '../../../src/data/articles';
import { ARTICLE_LANGUAGES } from '../../../src/data/articleI18n';
import type { ArticleBlock } from '../../../src/data/articles/types';
import {
  ARTICLE_AD_EVERY_SECTIONS, ARTICLE_AD_FIRST_SECTION, ARTICLE_AD_MAX_SLOTS, articleAdSections, articleBlocksForRender, renderArticleBody,
} from '../../../src/utils/articleRender';
import { AD_CLASS, AD_SLOT_LABELS, AD_SLOT_SCRIPT, adSlotHtml } from '../../../src/components/ui/atoms/adSlot';
import { ADSENSE_CLIENT } from '../../../src/config/ads';
import { PRODUCTION_ORIGIN } from '../../../src/utils/siteHost';

const h2 = (n: number): ArticleBlock => ({ type: 'h2', text: `見出し${n}` });
const p: ArticleBlock = { type: 'p', text: '本文' };
const shot: ArticleBlock = { type: 'shot', shot: 'x', alt: 'x' };
const shotWithCaption: ArticleBlock = { type: 'shot', shot: 'x', alt: 'x', caption: '説明' };
/** n 節の記事（各節は見出し＋段落。after に節番号→その節の最後に足すブロック） */
function article(n: number, after: Record<number, ArticleBlock> = {}): ArticleBlock[] {
  const blocks: ArticleBlock[] = [{ type: 'points', items: ['a'] }, { type: 'embed', map: 'main', title: 't' }];
  for (let i = 1; i <= n; i++) blocks.push(h2(i), p, ...(after[i] ? [after[i]] : []));
  return blocks;
}

describe('本文の広告の位置（articleAdSections）', () => {
  it('4つ目の見出しの前から、長文でも最大1枠', () => {
    expect(ARTICLE_AD_FIRST_SECTION).toBe(4);
    expect(ARTICLE_AD_MAX_SLOTS).toBe(1);
    expect(ARTICLE_AD_EVERY_SECTIONS).toBe(6);
    expect(articleAdSections(article(2))).toEqual([]);
    expect(articleAdSections(article(4))).toEqual([4]);
    expect(articleAdSections(article(8))).toEqual([4]);
    expect(articleAdSections(article(9))).toEqual([4]);
  });

  it('結論・冒頭の地図のデモと最初の3節の間には置かない', () => {
    for (let n = 1; n <= 10; n++) expect(articleAdSections(article(n)).every(s => s >= 4)).toBe(true);
  });

  it('説明文の無い地図のデモ・地図を開くボタンのすぐ下には置かず、後ろの節へずらす。ずらせなければ置かない', () => {
    expect(articleAdSections(article(5, { 3: shot }))).toEqual([5]);
    expect(articleAdSections(article(5, { 3: shot, 4: { type: 'cta', title: 't', text: 't', map: 'main' } }))).toEqual([]);
    expect(articleAdSections(article(7, { 3: shot, 4: shot, 5: shot }))).toEqual([7]);
    // ずらしても次の候補（9）を越えない。越える分は次の候補の側で置く
    const many = Object.fromEntries([3, 4, 5, 6, 7, 8, 9].map(n => [n, shot]));
    expect(articleAdSections(article(10, many))).toEqual([10]);
  });

  it('説明文のある地図のデモの下には置ける（ボタンと広告の間に文が挟まる）', () => {
    expect(articleAdSections(article(4, { 3: shotWithCaption }))).toEqual([4]);
  });
});

describe('記事の本文に入る広告枠（全記事・全言語）', () => {
  for (const source of ARTICLE_SOURCES) {
    for (const lang of ARTICLE_LANGUAGES) {
      it(`${source.slug} (${lang})`, () => {
        const html = renderArticleBody(source, lang);
        const sections = articleAdSections(articleBlocksForRender(source, lang));
        const ads = html.match(new RegExp(`<aside class="${AD_CLASS.slot}"`, 'g')) ?? [];
        expect(ads.length).toBe(sections.length);
        // 4節以上の記事には本文の間に広告が入る
        if (articleBlocksForRender(source, lang).filter(b => b.type === 'h2').length >= 4) expect(ads.length).toBe(1);
        // 広告のすぐ上が、説明文の無い地図の埋め込み・地図を開くボタンではない
        expect(html).not.toMatch(new RegExp(`</div></figure>\\s*<aside class="${AD_CLASS.slot}"`));
        expect(html).not.toMatch(new RegExp(`class="btn"[^]*?</a></div>\\s*<aside class="${AD_CLASS.slot}"`));
        // 広告は見出しの直前で、最初の見出しより後
        const first = html.indexOf('<h2');
        for (const m of html.matchAll(new RegExp(`<aside class="${AD_CLASS.slot}"[^]*?</aside>\\n`, 'g'))) {
          expect(m.index!).toBeGreaterThan(first);
          expect(html.slice(m.index! + m[0].length, m.index! + m[0].length + 3)).toBe('<h2');
        }
        // 記事の言語で「広告」と書く
        if (ads.length) expect(html).toContain(`>${AD_SLOT_LABELS[lang].label}</span>`);
      });
    }
  }
});

describe('広告枠の部品（ui/atoms/adSlot.ts）', () => {
  it('広告ユニット ID が空なら広告のタグを出さない（本番では枠ごと消える）', () => {
    const html = adSlotHtml({ slot: '', lang: 'ja', position: 'end' });
    expect(html).not.toContain('adsbygoogle');
    expect(html).toContain(AD_CLASS.placeholder);
  });

  it('ID があれば記事内広告のタグを出す', () => {
    const html = adSlotHtml({ slot: '1357924680', lang: 'en', position: 'inline-1' });
    expect(html).toContain(`data-ad-client="${ADSENSE_CLIENT}"`);
    expect(html).toContain('data-ad-slot="1357924680"');
    expect(html).toContain('data-ad-format="horizontal"');
    expect(html).not.toContain('data-ad-layout="in-article"');
    expect(html).toContain('aria-label="Advertisement"');
  });

  it('読み終わった後（関連記事の前）には置かない（2026-10-16: 1記事に2つは多すぎた）', () => {
    const layout = readFileSync(join(__dirname, '../../../src/components/articles/ArticleLayout.astro'), 'utf8');
    expect(layout).not.toMatch(/adSlotHtml|ad-slot/);
  });

  it('広告を読み込むのは本番のサイトだけ（プレビュー・手元では位置だけ見せる）', () => {
    expect(AD_SLOT_SCRIPT).toContain(`location.origin === ${JSON.stringify(PRODUCTION_ORIGIN)}`);
    expect(AD_SLOT_SCRIPT).toContain('is-preview');
    expect(AD_SLOT_SCRIPT).toContain('ins.remove()');
  });

  it('4言語の表記がある', () => {
    expect(Object.keys(AD_SLOT_LABELS).sort()).toEqual([...ARTICLE_LANGUAGES].sort());
  });
});
