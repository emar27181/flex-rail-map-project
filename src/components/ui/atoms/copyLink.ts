import { COPY_LINK_SUCCESS_EVENT } from '../../../utils/copyLinkEvent';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Share2 } from 'lucide-react';

/** URL・翻訳は呼び出し元から渡す。静的ページでも React の hydration は不要。 */
export function copyLinkHtml(labels: { copy: string; copied: string; failed: string }): string {
  const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return `<span data-copy-control><button type="button" class="ctl" data-copy-link hidden data-copied="${esc(labels.copied)}" data-failed="${esc(labels.failed)}">`
    + renderToStaticMarkup(createElement(Share2, { 'aria-hidden': true }))
    + `<span>${esc(labels.copy)}</span></button><span role="status" aria-live="polite" data-copy-status></span></span>`;
}

/** 同期的にURLを取得してユーザー操作の中でコピーを開始（Safariにも対応）。 */
export const COPY_LINK_SCRIPT = `function bindCopyLink(button, getUrl) {
  if (!button) return;
  button.hidden = false;
  var status = button.parentElement.querySelector('[data-copy-status]');
  button.addEventListener('click', function () {
    status.textContent = '';
    var value = getUrl();
    if (!value) { status.textContent = button.dataset.failed; return; }
    var fallback = function () {
      var input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      document.body.appendChild(input);
      input.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      input.remove();
      button.focus({ preventScroll: true });
      return ok;
    };
    var result = function (ok) { status.textContent = ok ? button.dataset.copied : button.dataset.failed; if (ok) button.dispatchEvent(new CustomEvent('${COPY_LINK_SUCCESS_EVENT}', { bubbles: true })); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () { result(true); }, function () { result(fallback()); });
    } else { result(fallback()); }
  });
}`;
