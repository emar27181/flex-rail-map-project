/**
 * 記事（/articles）の中の操作を GA4 に送るイベントの唯一の定義。
 *
 * 記事を読んだ人が、地図のデモを見たか・触ったか・地図へ移ったかを数える（記事を足したときの効果を比べるため）。
 * 送信は gtagConsent.ts の trackEvent を通す（GA4 は本番サイトでだけ読み込む。プレビュー・ローカルは送らない。
 * GA4 が無ければ何もしない）。値は記事の slug・言語・地図の名前だけで、個人を特定する情報は送らない。
 * 名前・パラメータを足したら docs/seo.md の「GA4 イベント」に追記する。
 *
 * 記事の閲覧そのものは GA4 の page_view で数えるので、別のイベントは作らない。
 */
import { trackEvent } from './gtagConsent';
import { COPY_LINK_SUCCESS_EVENT } from './copyLinkEvent';

export const ARTICLE_EVENTS = {
  /** 地図のデモが画面に入った（1つのデモにつき1回） */
  demoView: 'article_demo_view',
  /** 地図のデモの中を初めて触った（押す・ドラッグ・ホイール。1つのデモにつき1回） */
  demoInteract: 'article_demo_interact',
  /** デモを全画面にした */
  demoFullscreen: 'article_demo_fullscreen',
  /** 記事から地図のページへ移った（デモの「地図を大きく開く」・記事の最後のボタン） */
  mapOpen: 'article_map_open',
  /** 関連記事を開いた */
  relatedClick: 'article_related_click',
  /** 記事内デモの共有リンクのコピーに成功 */
  shareCopy: 'article_share_copy',
} as const;

/** パラメータの値は GA4 の上限（100文字）で切る */
const clip = (v: string) => v.slice(0, 100);

export interface ArticleEventContext {
  /** 記事の slug（言語に依らない記事の ID） */
  article: string;
  locale: string;
}

export function trackArticleEvent(
  name: (typeof ARTICLE_EVENTS)[keyof typeof ARTICLE_EVENTS],
  ctx: ArticleEventContext,
  extra: Record<string, string> = {},
): void {
  trackEvent(name, {
    article: clip(ctx.article),
    locale: clip(ctx.locale),
    ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, clip(v)])),
  });
}

/**
 * 記事のページに計測を付ける（ArticleLayout が1回呼ぶ）。
 * デモは mapEmbed.ts の figure（data-demo-id）、地図への移動は data-me-open・.cta .btn、関連記事は .related a
 */
export function initArticleAnalytics(ctx: ArticleEventContext, doc: Document = document): void {
  doc.addEventListener(COPY_LINK_SUCCESS_EVENT, (event) => {
    const figure = (event.target as Element)?.closest?.('figure[data-demo-id]');
    if (figure) trackArticleEvent(ARTICLE_EVENTS.shareCopy, ctx, { demo_id: (figure as HTMLElement).dataset.demoId ?? '' });
  });
  const figures = Array.from(doc.querySelectorAll<HTMLElement>('figure[data-demo-id]'));
  const seen = new Set<Element>();
  if (typeof IntersectionObserver !== 'undefined') {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting || seen.has(e.target)) continue;
        seen.add(e.target);
        trackArticleEvent(ARTICLE_EVENTS.demoView, ctx, { demo_id: (e.target as HTMLElement).dataset.demoId ?? '' });
        io.unobserve(e.target);
      }
    }, { threshold: 0.5 });
    figures.forEach(f => io.observe(f));
  }
  for (const fig of figures) {
    const demo = fig.dataset.demoId ?? '';
    const iframe = fig.querySelector('iframe');
    // 同じサイトの画面なので、読み込んだあとに中の操作を受け取れる。最初の1回だけ送る
    // 読み込み済みの iframe にも登録する。再読み込みされてもデモごとに1回だけ数える。
    let sent = false;
    const attached = new WeakSet<Document>();
    const once = () => {
      if (sent) return;
      sent = true;
      trackArticleEvent(ARTICLE_EVENTS.demoInteract, ctx, { demo_id: demo });
    };
    const attach = () => {
      try {
        const inner = iframe?.contentDocument;
        if (!inner || attached.has(inner)) return;
        attached.add(inner);
        inner.addEventListener('pointerdown', once, { passive: true });
        inner.addEventListener('wheel', once, { passive: true });
        inner.addEventListener('keydown', e => {
          if (['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-'].includes(e.key)) once();
        });
      } catch { /* 別のサイトの画面は数えない */ }
    };
    iframe?.addEventListener('load', attach);
    attach();
    fig.querySelector('[data-me-fullscreen]')?.addEventListener('click', () =>
      trackArticleEvent(ARTICLE_EVENTS.demoFullscreen, ctx, { demo_id: demo }));
    fig.querySelector('[data-me-open]')?.addEventListener('click', () =>
      trackArticleEvent(ARTICLE_EVENTS.mapOpen, ctx, { demo_id: demo, source: 'demo' }));
  }
  doc.querySelectorAll('.cta .btn').forEach(a => a.addEventListener('click', () =>
    trackArticleEvent(ARTICLE_EVENTS.mapOpen, ctx, { source: 'cta' })));
  doc.querySelectorAll<HTMLAnchorElement>('.related a').forEach(a => a.addEventListener('click', () =>
    trackArticleEvent(ARTICLE_EVENTS.relatedClick, ctx, { target: a.getAttribute('href') ?? '' })));
}
