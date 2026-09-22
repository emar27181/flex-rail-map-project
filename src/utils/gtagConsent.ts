/**
 * GA4のConsent Mode(同意状態)を、CookieBannerの選択と連動させるための小さなヘルパー。
 *
 * GA4は「同意（analytics_storage）」がgrantedになるまで実質何も送信しないよう
 * index.astro側でデフォルトdeniedにして読み込んでいる。CookieBannerで
 * ユーザーが選択を変えるたびにこの関数を呼び、grantedにするかどうかだけ伝える。
 * gtag自体が読み込まれていない（GA4未設定の環境）場合は何もしない。
 */

type GtagFn = (...args: unknown[]) => void;

function getGtag(): GtagFn | undefined {
  return (window as unknown as { gtag?: GtagFn }).gtag;
}

export function updateAnalyticsConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;
  const gtag = getGtag();
  if (!gtag) return;
  gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
}

/**
 * GA4へカスタムイベントを送る唯一の入口。
 *
 * GA4が未設定（gtag未読み込み）の環境や、同意が無くgtagがまだイベントを
 * 送らない状態でもエラーにならない（gtag自体は同意なしでも呼べる関数として
 * 存在し、送信を内部で抑制する）。SEOガイドページのCTAなど、
 * 新しく計測イベントを足す場所は必ずこの関数を経由させる。
 */
export function trackEvent(name: string, params?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  const gtag = getGtag();
  if (!gtag) return;
  gtag('event', name, params);
}
