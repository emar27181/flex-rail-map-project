/**
 * 実際の画面（地図・駅/路線のページ）を iframe で埋め込む部品の規格。
 *
 * 記事のスクリーンショットは小さくて読みにくかったため、画像をやめて実際の画面を埋め込む。
 * 記事（articleRender.ts）と駅・路線のページ（MapEmbed.astro）で同じ HTML・CSS・スクリプトを使う。
 *
 * - 押すまでは中に触れない（スマホでスクロールの指が地図を動かさないように）。
 *   枠のどこを押しても使えるようにする（小さなボタンだけが押せる形だと、地図を押しても動かないと感じる）。
 *   文言は枠の下に `.ctl` の見た目で出す
 * - 画面に近づくまで読み込まない（loading="lazy"）
 * - 高さは端末に合わせて 360〜520px（画面の高さの 62%）
 * - 中の画面のテーマ（ライト/ダーク）を埋め込んだページに合わせる。開くときは URL の `theme`、
 *   ページで切り替えたときは postMessage で伝える（受け取る側は contexts/ThemeContext.tsx, utils/themeStorage.ts）
 *
 * 色は各レイアウトが CSS 変数で渡す: `--me-border`（枠）/ `--me-surface`（読み込み前の地）/
 * `--me-shadow`（影）/ `--me-muted`（説明文）。枠は色を付けない（2026-10: 路線色の線は要らないと判断）。
 */
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import { EMBED_PARAM } from '../../../utils/embedMode';
import { THEME_MESSAGE, THEME_PARAM } from '../../../utils/themeStorage';

export const ME_CLASS = { figure: 'map-embed', frame: 'map-embed-frame', active: 'active', button: 'map-embed-activate', label: 'map-embed-label' } as const;

const esc = (s: string) => s.replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');

export interface MapEmbedProps {
  /** 埋め込む画面の URL（地図は mapDeepLink.ts の buildMapHref に embed: true を付けて作る） */
  src: string;
  /** iframe の title（読み上げ用。何の画面か） */
  title: string;
  /** 下に添える説明（HTML 可） */
  caption?: string;
  /** 「押すと操作できる」ボタンの文言 */
  activateLabel: string;
}

export function mapEmbedHtml({ src, title, caption, activateLabel }: MapEmbedProps): string {
  return `<figure class="${ME_CLASS.figure}"><div class="${ME_CLASS.frame}" data-activate-label="${esc(activateLabel)}">`
    + `<iframe src="${esc(src)}" title="${esc(title)}" loading="lazy"></iframe></div>`
    + (caption ? `<figcaption>${caption}</figcaption>` : '')
    + `</figure>`;
}

export const MAP_EMBED_CSS = `
.${ME_CLASS.figure} { margin: ${L.sp['3xl']} 0; padding: 0; }
.${ME_CLASS.frame} {
  position: relative; height: clamp(360px, 62vh, 520px); overflow: hidden;
  border: 1px solid var(--me-border, currentColor);
  border-radius: ${L.r.card}; background: var(--me-surface, transparent); box-shadow: var(--me-shadow, none);
}
.${ME_CLASS.frame} iframe { display: block; width: 100%; height: 100%; border: 0; pointer-events: none; }
.${ME_CLASS.frame}.${ME_CLASS.active} iframe { pointer-events: auto; }
/* 枠全体を覆う透明なボタン。押すと消えて中を操作できる */
.${ME_CLASS.button} {
  position: absolute; inset: 0; z-index: 1; display: flex; align-items: flex-end; justify-content: center;
  padding: 0 0 ${L.sp.md}; margin: 0; border: 0; background: transparent; color: inherit; font: inherit; cursor: pointer;
}
.${ME_CLASS.button}:focus-visible { outline: 2px solid currentColor; outline-offset: -2px; }
.${ME_CLASS.label} { pointer-events: none; }
.${ME_CLASS.figure} figcaption { margin-top: ${L.sp.sm}; font-size: ${FS.caption}; line-height: 1.7; color: var(--me-muted, inherit); }
`;

/**
 * 埋め込みのスクリプト（ページに1回だけ入れる）。
 * 押すまで中に触れないようにし、中の画面のテーマをページのテーマに合わせる。
 * ページのテーマは、記事は html の data-theme、ほかのページは body の class（無ければライト）
 */
export const MAP_EMBED_SCRIPT = `(function(){
  var frames = document.querySelectorAll('.${ME_CLASS.frame}');
  if (!frames.length) return;
  function pageTheme() {
    var d = document.documentElement.getAttribute('data-theme');
    if (d === 'light' || d === 'dark') return d;
    return document.body.classList.contains('dark') ? 'dark' : 'light';
  }
  var theme = pageTheme();
  frames.forEach(function (frame) {
    var iframe = frame.querySelector('iframe');
    if (iframe) {
      try {
        var u = new URL(iframe.getAttribute('src'), window.location.href);
        if (u.origin === window.location.origin && u.searchParams.get('${EMBED_PARAM}') === '1' && u.searchParams.get('${THEME_PARAM}') !== theme) {
          u.searchParams.set('${THEME_PARAM}', theme);
          iframe.setAttribute('src', u.pathname + u.search + u.hash);
        }
      } catch (e) {}
    }
    if (frame.querySelector('.${ME_CLASS.button}')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = '${ME_CLASS.button}';
    var label = document.createElement('span');
    label.className = 'ctl ${ME_CLASS.label}';
    label.textContent = frame.getAttribute('data-activate-label') || '';
    btn.appendChild(label);
    btn.addEventListener('click', function () { frame.classList.add('${ME_CLASS.active}'); btn.remove(); });
    frame.appendChild(btn);
  });
  function sync() {
    var next = pageTheme();
    if (next === theme) return;
    theme = next;
    frames.forEach(function (frame) {
      var iframe = frame.querySelector('iframe');
      if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ type: '${THEME_MESSAGE}', theme: theme }, window.location.origin);
    });
  }
  var mo = new MutationObserver(sync);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();`;
