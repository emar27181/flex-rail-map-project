import type { Page } from '@playwright/test';

/** 切れて見えている文字（どの要素の、どの文字が、何px はみ出しているか） */
export interface ClippedText {
  text: string;
  where: string;
  overflowPx: number;
}

/**
 * 画面に見えている文字のうち、枠に収まらずに切れているものを探す。
 *
 * 英語など文字数の多い言語で、ボタンや見出しの文字が「departur」のように途中で切れていた（2026-10-15）。
 * 文字（テキストノード）の実際の範囲を測り、それを切り取る祖先（overflow が visible 以外）の
 * 内側からはみ出していれば「切れている」とする。text-overflow: ellipsis で「…」になっているものも数える。
 *
 * - 地図の上の駅名ラベル（Leaflet のマーカー）は対象外（地図の端で切れるのは正常）
 * - 見えていない要素（display: none・幅0・画面の外）は数えない
 */
export async function findClippedText(page: Page, tolerancePx = 1): Promise<ClippedText[]> {
  return page.evaluate((tol) => {
    const out: Array<{ text: string; where: string; overflowPx: number }> = [];
    const describe = (el: Element) => {
      const parts: string[] = [];
      for (let e: Element | null = el; e && parts.length < 3; e = e.parentElement) {
        const label = e.getAttribute('aria-label') || e.getAttribute('data-testid') || (e.className && typeof e.className === 'string' ? `.${e.className.split(' ')[0]}` : '');
        parts.unshift(`${e.tagName.toLowerCase()}${label ? `[${label}]` : ''}`);
      }
      return parts.join(' > ');
    };
    const clips = (el: Element) => {
      const s = getComputedStyle(el);
      return s.overflowX !== 'visible' || s.overflowY !== 'visible';
    };
    const vw = window.innerWidth, vh = window.innerHeight;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set<Element>();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = (n.textContent ?? '').trim();
      if (!text) continue;
      const el = n.parentElement;
      if (!el || seen.has(el)) continue;
      if (el.closest('.leaflet-marker-pane, .leaflet-tooltip-pane, .leaflet-control-attribution, script, style, noscript, [aria-hidden="true"]')) continue;
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // 画面の外（スクロールしないと見えない所）は数えない
      if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
      // 「…」で省略されている
      let worst = 0;
      if (style.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + tol) worst = el.scrollWidth - el.clientWidth;
      // 切り取る祖先の内側からはみ出している
      for (let a: Element | null = el; a && a !== document.body; a = a.parentElement) {
        if (!clips(a)) continue;
        const b = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        const left = b.left + parseFloat(cs.borderLeftWidth);
        const right = b.right - parseFloat(cs.borderRightWidth);
        const over = Math.max(left - r.left, r.right - right);
        // スクロールできる箱（overflow: auto/scroll）で横に動かせるものは切れていない扱い
        const scrollable = /auto|scroll/.test(cs.overflowX) && a.scrollWidth > a.clientWidth;
        if (over > tol && !scrollable) worst = Math.max(worst, over);
      }
      if (worst > tol) {
        seen.add(el);
        out.push({ text: text.slice(0, 60), where: describe(el), overflowPx: Math.round(worst) });
      }
    }
    // 入力欄・選択欄の文字（placeholder・選んだ値）はテキストノードではないので、文字の幅を測って比べる
    const ctx = document.createElement('canvas').getContext('2d')!;
    for (const el of Array.from(document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'))) {
      if (el.closest('[aria-hidden="true"]')) continue;
      const type = (el as HTMLInputElement).type;
      if (['checkbox', 'radio', 'range', 'hidden', 'color', 'file'].includes(type)) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const text = el instanceof HTMLSelectElement
        ? (el.selectedOptions[0]?.textContent ?? '').trim()
        : (el.value || el.getAttribute('placeholder') || '').trim();
      if (!text) continue;
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const textW = ctx.measureText(text).width;
      // 選択欄の右の矢印はブラウザが内側に足して幅を決めるので、引かない（引くと収まっている選択欄まで数えてしまう）
      const room = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (textW - room > tol) out.push({ text: text.slice(0, 60), where: describe(el), overflowPx: Math.round(textW - room) });
    }
    return out;
  }, tolerancePx);
}
