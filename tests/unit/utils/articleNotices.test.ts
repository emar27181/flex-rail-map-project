import { describe, it, expect } from 'vitest';
import { ARTICLE_SOURCES } from '../../../src/data/articles';
import { articleBlocksForRender, articleMapHref, renderArticleBody } from '../../../src/utils/articleRender';
import {
  MODE_NOTICE_KINDS, NOTICE_KINDS, NOTICE_LABELS, NOTICE_TEXTS, requiredNoticeKinds, noticeHtml,
} from '../../../src/utils/articleNotices';
import { getInitialMapModeFromUrl, parseExtraDepartures, parseMapMode, MAP_MODES } from '../../../src/utils/mapModeUrlParam';
import type { ArticleLang } from '../../../src/data/articles/types';

const LANGS: ArticleLang[] = ['ja', 'en', 'zh', 'ko'];
const bySlug = (slug: string) => ARTICLE_SOURCES.find(a => a.slug === slug)!;

describe('記事の注意書き（試作・架空のデータ・推定を含む）', () => {
  it('どの種類も4言語の見出しと文がそろっている', () => {
    for (const lang of LANGS) {
      for (const kind of NOTICE_KINDS) {
        expect(NOTICE_LABELS[lang][kind].length, `${lang} ${kind} label`).toBeGreaterThan(0);
        expect(NOTICE_TEXTS[lang][kind].length, `${lang} ${kind} text`).toBeGreaterThan(20);
      }
    }
  });

  it('モードごとに必要な注意書きが決まっている（終電モードは試作＋架空、集合駅は推定）', () => {
    expect(MODE_NOTICE_KINDS['last-train']).toEqual(['prototype', 'fictional']);
    expect(MODE_NOTICE_KINDS.meeting).toEqual(['estimated']);
    for (const mode of MAP_MODES) expect(MODE_NOTICE_KINDS[mode].length, mode).toBeGreaterThan(0);
  });

  it('終電モードの記事は試作と架空、集合駅の記事は推定、所要時間を出す記事も推定が要る', () => {
    expect(requiredNoticeKinds(bySlug('last-train-mode-guide'))).toEqual(['prototype', 'fictional']);
    expect(requiredNoticeKinds(bySlug('meeting-station-finder'))).toEqual(['estimated']);
    expect(requiredNoticeKinds(bySlug('commute-30min-cheap-rent'))).toEqual(['estimated']);
    // モードも所要時間も使わない記事には付けない
    expect(requiredNoticeKinds(bySlug('flex-rail-map-introduction'))).toEqual([]);
  });

  it('必要な注意書きが、全記事・全言語で、最初の地図デモの直後（説明の前）に出る', () => {
    for (const a of ARTICLE_SOURCES) {
      const need = requiredNoticeKinds(a);
      for (const lang of LANGS) {
        const blocks = articleBlocksForRender(a, lang);
        if (need.length === 0) {
          expect(blocks.some(b => b.type === 'notice' && !a.content[lang].blocks.includes(b)), `${a.slug} ${lang} 余計な注意書き`).toBe(false);
          continue;
        }
        expect(blocks[1].type, `${a.slug} ${lang} 結論直後は地図デモ`).toBe('embed');
        const afterDemo = blocks.slice(2, 2 + need.length);
        expect(afterDemo.map(b => (b.type === 'notice' ? b.kind : b.type)), `${a.slug} ${lang}`).toEqual(need);
        const html = renderArticleBody(a, lang);
        for (const kind of need) expect(html, `${a.slug} ${lang} ${kind}`).toContain(`data-notice="${kind}"`);
        // 最初の見出しより前に出ている
        expect(html.indexOf('data-notice='), `${a.slug} ${lang}`).toBeLessThan(html.indexOf('<h2'));
      }
    }
  });

  it('本文に同じ種類の注意書きを書いてあれば、自動では足さない（二重に出さない）', () => {
    const base = bySlug('meeting-station-finder');
    const withManual = {
      ...base,
      content: {
        ...base.content,
        ja: { ...base.content.ja, blocks: [...base.content.ja.blocks.slice(0, -1), { type: 'notice' as const, kind: 'estimated' as const, text: '追記' }, base.content.ja.blocks[base.content.ja.blocks.length - 1]] },
      },
    };
    const html = renderArticleBody(withManual, 'ja');
    expect(html.match(/data-notice="estimated"/g)?.length).toBe(1);
    expect(html).toContain('追記');
  });

  it('注意書きの HTML は役割（note）・種類・見出しを持つ', () => {
    const html = noticeHtml('prototype', 'ja');
    expect(html).toContain('role="note"');
    expect(html).toContain('data-notice="prototype"');
    expect(html).toContain(NOTICE_LABELS.ja.prototype);
    expect(html).toContain(NOTICE_TEXTS.ja.prototype);
  });
});

describe('モードを入れて開く記事の地図', () => {
  it('モードの地図は、そのモードが動くための駅がそろっている（終電は到着駅、集合駅は出発駅と追加の出発駅）', () => {
    for (const a of ARTICLE_SOURCES) {
      for (const [key, m] of Object.entries(a.maps)) {
        if (m.mode === 'last-train') expect(m.to, `${a.slug} ${key}`).toBeTruthy();
        if (m.mode === 'meeting') {
          expect(m.from, `${a.slug} ${key}`).toBeTruthy();
          expect((m.withStations ?? []).length, `${a.slug} ${key}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('URL は mode と、駅は英語slugで作る（日本語の駅名を直接書かない）', () => {
    const lt = articleMapHref(bySlug('last-train-mode-guide').maps.main, 'ja', true);
    expect(lt).toContain('mode=last-train');
    expect(lt).toContain('to=shibuya');
    const mt = articleMapHref(bySlug('meeting-station-finder').maps.main, 'en', true);
    expect(mt).toContain('mode=meeting');
    expect(mt).toContain('from=shinjuku');
    expect(mt).toContain('with=tokyo%2Cyokohama');
    expect(decodeURIComponent(lt) + decodeURIComponent(mt)).not.toMatch(/[ぁ-んァ-ヶ一-龠]/);
  });
});

describe('URL パラメータ mode / with', () => {
  it('mode は決まった値だけ受け付ける', () => {
    expect(parseMapMode('last-train')).toBe('last-train');
    expect(parseMapMode('meeting')).toBe('meeting');
    expect(parseMapMode('nope')).toBeNull();
    expect(parseMapMode(null)).toBeNull();
  });

  it('with は英語slug（旧形式の日本語名も）を駅に戻し、重複と上限を整える', () => {
    expect(parseExtraDepartures('tokyo,yokohama').map(s => s.name)).toEqual(['東京', '横浜']);
    expect(parseExtraDepartures('東京,tokyo,unknown-station').map(s => s.name)).toEqual(['東京']);
    expect(parseExtraDepartures('').length).toBe(0);
    expect(parseExtraDepartures('tokyo,shibuya,shinjuku,yokohama,ueno,ikebukuro,shinagawa').length).toBeLessThanOrEqual(5);
  });

  it('ブラウザ以外では mode を読まない', () => {
    expect(getInitialMapModeFromUrl()).toBeNull();
  });
});
