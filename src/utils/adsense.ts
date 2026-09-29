// Remember each DOM slot so React StrictMode cannot queue it twice.
const requestedAds = new WeakSet<HTMLElement>();

export function requestAd(element: HTMLElement | null): void {
  if (!element || typeof window === 'undefined' || requestedAds.has(element)
    || element.hasAttribute('data-adsbygoogle-status')) return;

  requestedAds.add(element);
  try {
    // AdSense consumes this queue when its deferred script finishes loading.
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (error) {
    console.error('AdSense error:', error);
  }
}
