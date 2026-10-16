/**
 * 記事の地図デモの状態 → 地図の URL（articleRender.ts の articleMapHref / mapDeepLink.ts）。
 * 地図側が読むパラメータ（mapDisplayUrlParam.ts など）と食い違わないことを確かめる。
 */
import { describe, it, expect } from 'vitest';
import { articleMapHref, ARTICLE_FOCUS_ZOOM } from '../../../src/utils/articleRender';
import { parseDisplayUrlParams } from '../../../src/utils/mapDisplayUrlParam';
import { findArticleStation } from '../../../src/utils/articleFacts';
import { mapEmbedHtml } from '../../../src/components/ui/atoms/mapEmbed';

const query = (href: string) => new URLSearchParams(href.split('?')[1] ?? '');

describe('記事の地図デモの URL', () => {
  it('focus は路線データの駅の座標を中心にし、拡大率を省くと駅を見る拡大率になる', () => {
    const href = articleMapHref({ routes: ['yamanote'], focus: { name: '渋谷', route: 'yamanote' } }, 'en', true);
    const st = findArticleStation({ name: '渋谷', route: 'yamanote' })!;
    expect(query(href).get('center')).toBe(`${st.lat},${st.lng}`);
    expect(query(href).get('zoom')).toBe(String(ARTICLE_FOCUS_ZOOM));
  });

  it('記事の初期位置を路線全体から求め、東京駅固定にしない', () => {
    const params = query(articleMapHref({ routes: ['enoshimaElectricRailway'], zoom: 13 }, 'ja', true));
    const center = params.get('center')?.split(',').map(Number) ?? [];
    expect(center).toHaveLength(2);
    expect(center[0]).toBeGreaterThan(35.2);
    expect(center[0]).toBeLessThan(35.4);
    expect(center[1]).toBeLessThan(139.7);
    // 記事に指定されたズーム値は全線フィット計算で置き換える。
    expect(Number(params.get('zoom'))).toBeLessThan(13);
  });

  it('複数の路線も一括で範囲計算し、明示的な中心とfocusは保つ', () => {
    const a = query(articleMapHref({ routes: ['enoshimaElectricRailway', 'yamanote'] }, 'en', true));
    expect(a.get('center')).toBeTruthy();
    expect(Number(a.get('zoom'))).toBeGreaterThanOrEqual(2);
    const explicit = query(articleMapHref({ routes: ['yamanote'], center: [35.68, 139.76], zoom: 12 }, 'en', true));
    expect(explicit.get('center')).toBe('35.68,139.76');
    expect(explicit.get('zoom')).toBe('12');
  });

  it('路線に無い駅を focus にすると止める', () => {
    expect(() => articleMapHref({ focus: { name: '梅田', route: 'yamanote' } }, 'en')).toThrow(/梅田/);
  });

  it('駅番号・立体表示は地図側が読む値で付き、地図側で同じ状態に戻る', () => {
    const href = articleMapHref({ routes: ['yamanote'], stationNumbers: true, view: '3d' }, 'ja', true);
    expect(parseDisplayUrlParams(`?${href.split('?')[1]}`)).toMatchObject({ stationNumbers: true, view: 'terrain3d' });
    expect(articleMapHref({ routes: ['yamanote'] }, 'ja')).not.toMatch(/numbers=|view=/);
  });
});

describe('埋め込みの下の操作（mapEmbed.ts）', () => {
  it('openHref を渡すと、記事の言語で「地図を大きく開く」と全画面のボタン・読み込み中の案内が付く', () => {
    const html = mapEmbedHtml({ src: '/?embed=1', title: 't', openHref: '/?routes=yama', lang: 'en', demoId: 'a/main' });
    expect(html).toContain('data-demo-id="a/main"');
    expect(html).toMatch(/<a class="ctl" href="\/\?routes=yama" data-me-open>Open the full map<\/a>/);
    expect(html).toContain('data-me-fullscreen hidden');
    expect(html).toContain('Loading the map');
  });

  it('openHref が無ければ操作を出さない（駅・路線のページの埋め込みは今まで通り）', () => {
    expect(mapEmbedHtml({ src: '/?embed=1', title: 't' })).not.toMatch(/data-me-open|map-embed-status/);
  });
});
