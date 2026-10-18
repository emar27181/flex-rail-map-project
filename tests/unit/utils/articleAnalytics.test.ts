/**
 * 記事の中の操作の GA4 イベント（utils/articleAnalytics.ts）。
 */
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ARTICLE_EVENTS, initArticleAnalytics, trackArticleEvent } from '../../../src/utils/articleAnalytics';
import { mapEmbedHtml } from '../../../src/components/ui/atoms/mapEmbed';

describe('記事の GA4 イベント', () => {
  const gtag = vi.fn();
  beforeEach(() => { gtag.mockClear(); (window as unknown as { gtag: typeof gtag }).gtag = gtag; });

  it('記事の slug・言語を付けて送り、値は100文字で切る', () => {
    trackArticleEvent(ARTICLE_EVENTS.demoFullscreen, { article: 'x', locale: 'en' }, { demo_id: 'a'.repeat(150) });
    expect(gtag).toHaveBeenCalledWith('event', 'article_demo_fullscreen', expect.objectContaining({ article: 'x', locale: 'en' }));
    expect((gtag.mock.calls[0][2] as { demo_id: string }).demo_id).toHaveLength(100);
  });

  it('デモの「地図を大きく開く」・記事の最後のボタン・関連記事の押下を送る', () => {
    document.body.innerHTML = mapEmbedHtml({ src: '/?embed=1', title: 't', openHref: '/?x', lang: 'en', demoId: 'art/main' })
      + '<div class="cta"><a class="btn" href="/">go</a></div><section class="related"><a href="/en/articles/y">y</a></section>';
    initArticleAnalytics({ article: 'art', locale: 'en' });
    document.querySelector<HTMLAnchorElement>('[data-me-open]')!.dispatchEvent(new MouseEvent('click'));
    document.querySelector<HTMLAnchorElement>('.cta .btn')!.dispatchEvent(new MouseEvent('click'));
    document.querySelector<HTMLAnchorElement>('.related a')!.dispatchEvent(new MouseEvent('click'));
    const names = gtag.mock.calls.map(c => c[1]);
    expect(names).toEqual(['article_map_open', 'article_map_open', 'article_related_click']);
    expect(gtag.mock.calls[0][2]).toMatchObject({ demo_id: 'art/main', source: 'demo' });
  });

  it('GA4 が無い環境でも落ちない', () => {
    delete (window as unknown as { gtag?: unknown }).gtag;
    expect(() => trackArticleEvent(ARTICLE_EVENTS.mapOpen, { article: 'x', locale: 'ja' })).not.toThrow();
  });

  it('先に読み込まれたデモの操作も拾い、load が再発しても1回だけ数える', () => {
    document.body.innerHTML = '<figure data-demo-id="art/main"><iframe></iframe></figure>';
    const iframe = document.querySelector('iframe')!;
    initArticleAnalytics({ article: 'art', locale: 'ja' });
    iframe.contentDocument!.dispatchEvent(new Event('pointerdown'));
    iframe.dispatchEvent(new Event('load'));
    iframe.contentDocument!.dispatchEvent(new Event('wheel'));
    expect(gtag.mock.calls.filter(c => c[1] === ARTICLE_EVENTS.demoInteract)).toHaveLength(1);
  });

  it('キーボードで地図を操作した場合も数える（Tab の移動だけでは数えない）', () => {
    document.body.innerHTML = '<figure data-demo-id="art/main"><iframe></iframe></figure>';
    initArticleAnalytics({ article: 'art', locale: 'ja' });
    const inner = document.querySelector('iframe')!.contentDocument!;
    inner.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(gtag).not.toHaveBeenCalled();
    inner.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(gtag).toHaveBeenCalledWith('event', ARTICLE_EVENTS.demoInteract, {
      article: 'art', locale: 'ja', demo_id: 'art/main',
    });
  });
});
