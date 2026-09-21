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
