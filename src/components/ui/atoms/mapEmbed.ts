/**
 * 実際の画面（地図・駅/路線のページ）を iframe で埋め込む部品の規格。
 *
 * 記事のスクリーンショットは小さくて読みにくかったため、画像をやめて実際の画面を埋め込む。
 * 記事（articleRender.ts）と駅・路線のページ（MapEmbed.astro）で同じ HTML・CSS・スクリプトを使う。
 *
 * - 最初から中を操作できる（2026-10: 以前は押すまで触れない形にしていたが、
 *   「タップしなくても地図が動くように」との判断で外した）
 * - 画面に近づくまで読み込まない（loading="lazy"）
 * - 高さは端末に合わせて 360〜520px（画面の高さの 62%）。スマホでは縦長の枠（MAP_EMBED_PHONE）
 * - 読み込むまでは、同じ画面を撮った画像（poster, src/seo/mapPreview.ts）を下に敷いて見せる。検索エンジンにも
 *   ページの中身として同じ画像が見える（og:image と同じ画像）。画像が無いページは敷かない
 * - 中の画面のテーマ（ライト/ダーク）を埋め込んだページに合わせる。開くときは URL の `theme`、
 *   ページで切り替えたときは postMessage で伝える（受け取る側は contexts/ThemeContext.tsx, utils/themeStorage.ts）
 *
 * 色は各レイアウトが CSS 変数で渡す: `--me-border`（枠）/ `--me-surface`（読み込み前の地）/
 * `--me-shadow`（影）/ `--me-muted`（説明文）。枠は色を付けない（2026-10: 路線色の線は要らないと判断）。
 */
import { FS } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';
import { EMBED_PARAM, EMBED_SECTION_PARAM } from '../../../utils/embedMode';
import { copyLinkHtml, COPY_LINK_SCRIPT } from './copyLink';
import { CONTROL_SIZE } from './controlSize';
import { THEME_MESSAGE, THEME_PARAM } from '../../../utils/themeStorage';
import { MEDIA } from '../../../constants/breakpoints';

export const ME_CLASS = {
  figure: 'map-embed', frame: 'map-embed-frame', status: 'map-embed-status', actions: 'map-embed-actions', poster: 'map-embed-poster',
} as const;

/**
 * 埋め込みの下の操作と、読み込み中の案内の文言（言語ごと）。
 * - 「地図を大きく開く」: 同じ状態の地図を普通の画面で開く（記事の外に出て全部の操作ができる）
 * - 「全画面」: この枠を画面いっぱいにする（ブラウザが対応していないときは出さない。iPhone の Safari など）
 * - 読み込み中: 枠の地に出す文字。地図が描かれると隠れる。読み込めないときもリンクから開ける
 */
export const MAP_EMBED_LABELS = {
  ja: { open: '地図を大きく開く', fullscreen: '全画面', loading: '地図を読み込んでいます。表示されないときは「地図を大きく開く」から開けます。' },
  en: { open: 'Open the full map', fullscreen: 'Full screen', loading: 'Loading the map. If it does not appear, use “Open the full map”.' },
  zh: { open: '打开完整地图', fullscreen: '全屏', loading: '正在加载地图。如果没有显示，请点击“打开完整地图”。' },
  ko: { open: '지도 크게 열기', fullscreen: '전체 화면', loading: '지도를 불러오는 중입니다. 표시되지 않으면 ‘지도 크게 열기’를 눌러 주세요.' },
} as const;
export type MapEmbedLang = keyof typeof MAP_EMBED_LABELS;

export const MAP_SHARE_LABELS = {
  ja: { copy: 'リンクをコピー', copied: 'コピーしました', failed: 'コピーできませんでした。「地図を大きく開く」からURLをコピーしてください。' },
  en: { copy: 'Copy map link', copied: 'Link copied', failed: 'Could not copy. Open the full map and copy its URL.' },
  zh: { copy: '复制地图链接', copied: '链接已复制', failed: '无法复制。请打开完整地图并复制网址。' },
  ko: { copy: '지도 링크 복사', copied: '링크를 복사했습니다', failed: '복사하지 못했습니다. 지도를 크게 열어 URL을 복사해 주세요.' },
} as const;

/**
 * スマホで見るときの枠。スマホの画面と同じ縦長にし、中の地図もスマホの画面のまま見せる（2026-10-15:
 * 横長の枠では縦が足りなかった）。大きさはユーザーの別サイト（my-net-homepage-project の作品の埋め込み
 * `.works-preview-frame`）に合わせた: 幅は最大 390px、縦横比 9:17.5
 */
export const MAP_EMBED_PHONE = { maxWidthPx: 390, aspectRatio: '9 / 17.5' } as const;

const esc = (s: string) => s.replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');

export interface MapEmbedProps {
  /** 埋め込む画面の URL（地図は mapDeepLink.ts の buildMapHref に embed: true を付けて作る） */
  src: string;
  /** iframe の title（読み上げ用。何の画面か） */
  title: string;
  /** 下に添える説明（HTML 可） */
  caption?: string;
  /** 同じ画面を埋め込みでなく開く URL。渡すと下に「地図を大きく開く」「全画面」を出す */
  openHref?: string;
  /** 下の操作・読み込み中の文言の言語（openHref を渡すとき） */
  lang?: MapEmbedLang;
  /** 計測用の名前（記事の slug/地図のキー。GA4 の demo_id） */
  demoId?: string;
  /** 読み込むまで下に敷く、同じ画面を撮った画像（src/seo/mapPreview.ts の existingMapPreview） */
  poster?: string;
}

const posterHtml = (poster: string, alt: string) =>
  `<img class="${ME_CLASS.poster}" src="${esc(poster)}" alt="${esc(alt)}" width="1200" height="630" decoding="async">`;

export function mapEmbedHtml({ src, title, caption, poster, openHref, lang = 'ja', demoId }: MapEmbedProps): string {
  const t = MAP_EMBED_LABELS[lang];
  return `<figure class="${ME_CLASS.figure}"${demoId ? ` data-demo-id="${esc(demoId)}"` : ''}><div class="${ME_CLASS.frame}">`
    + (openHref ? `<p class="${ME_CLASS.status}">${t.loading}</p>` : '')
    + (poster ? posterHtml(poster, title) : '')
    + `<iframe src="${esc(src)}" title="${esc(title)}" loading="lazy"></iframe></div>`
    + (openHref
      ? `<div class="${ME_CLASS.actions}"><a class="ctl" href="${esc(openHref)}" data-me-open>${t.open}</a>`
        + copyLinkHtml(MAP_SHARE_LABELS[lang])
        + `<button type="button" class="ctl" data-me-fullscreen hidden>${t.fullscreen}</button></div>`
      : '')
    + (caption ? `<figcaption>${caption}</figcaption>` : '')
    + `</figure>`;
}

/**
 * 組み立て済みの本文（記事）の最初の埋め込みにだけ、読み込むまで敷く画像を足す。
 * 画像は冒頭の地図を撮ったものなので、2つ目以降の埋め込みには付けない
 */
export function withFirstEmbedPoster(html: string, poster: string | undefined): string {
  if (!poster) return html;
  const m = html.match(new RegExp(`<div class="${ME_CLASS.frame}">((?:<p class="${ME_CLASS.status}">[\\s\\S]*?</p>)?)(<iframe [^>]*title="([^"]*)")`));
  if (!m || m.index === undefined) return html;
  const at = m.index + `<div class="${ME_CLASS.frame}">`.length + m[1].length;
  return html.slice(0, at) + posterHtml(poster, m[3]) + html.slice(at);
}

export const MAP_EMBED_CSS = `
.${ME_CLASS.figure} { margin: ${L.sp['3xl']} 0; padding: 0; }
.${ME_CLASS.frame} {
  position: relative; height: clamp(360px, 62vh, 520px); overflow: hidden;
  border: 1px solid var(--me-border, currentColor);
  border-radius: ${L.r.card}; background: var(--me-surface, transparent); box-shadow: var(--me-shadow, none);
}
.${ME_CLASS.frame} iframe { position: relative; display: block; width: 100%; height: 100%; border: 0; }
.${ME_CLASS.status} {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; margin: 0;
  padding: ${L.sp['3xl']}; text-align: center; font-size: ${FS.caption}; line-height: 1.7; color: var(--me-muted, inherit);
}
.${ME_CLASS.actions} { display: flex; flex-wrap: wrap; gap: ${L.sp.sm}; margin-top: ${L.sp.sm}; }
.${ME_CLASS.actions} .ctl { min-height: ${CONTROL_SIZE.md.minHeight}px; }
.${ME_CLASS.actions} [hidden] { display: none; }
.${ME_CLASS.actions} [data-copy-control] { display: contents; }
.${ME_CLASS.actions} [data-copy-status] { align-self: center; font-size: ${FS.caption}; color: var(--me-muted, inherit); }
.${ME_CLASS.actions} [data-copy-status]:empty { display: none; }

.${ME_CLASS.poster} { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
@media ${MEDIA.mobile} {
  .${ME_CLASS.frame} { width: min(100%, ${MAP_EMBED_PHONE.maxWidthPx}px); height: auto; aspect-ratio: ${MAP_EMBED_PHONE.aspectRatio}; margin: 0 auto; }
}
.${ME_CLASS.frame}:fullscreen { width: 100%; max-width: none; height: 100%; aspect-ratio: auto; margin: 0; border-radius: 0; }
.${ME_CLASS.figure} figcaption { margin-top: ${L.sp.sm}; font-size: ${FS.caption}; line-height: 1.7; color: var(--me-muted, inherit); }
`;

/**
 * 埋め込みのスクリプト（ページに1回だけ入れる）。
 * 中の画面のテーマをページのテーマに合わせる。
 * ページのテーマは、記事は html の data-theme、ほかのページは body の class（無ければライト）
 */
export const MAP_EMBED_SCRIPT = `(function(){
  ${COPY_LINK_SCRIPT}
  var frames = document.querySelectorAll('.${ME_CLASS.frame}');
  if (!frames.length) return;
  function pageTheme() {
    var d = document.documentElement.getAttribute('data-theme');
    if (d === 'light' || d === 'dark') return d;
    return document.body.classList.contains('dark') ? 'dark' : 'light';
  }
  // 全画面: ブラウザが対応しているときだけボタンを出す（iPhone の Safari は要素の全画面に対応していない）
  if (document.fullscreenEnabled) {
    document.querySelectorAll('[data-me-fullscreen]').forEach(function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () {
        var frame = btn.closest('.${ME_CLASS.figure}').querySelector('.${ME_CLASS.frame}');
        if (document.fullscreenElement) document.exitFullscreen(); else if (frame) frame.requestFullscreen();
      });
    });
  }
  var theme = pageTheme();
  frames.forEach(function (frame) {
    var iframe = frame.querySelector('iframe');
    var figure = frame.closest('.${ME_CLASS.figure}');
    var open = figure.querySelector('[data-me-open]');
    function currentUrl() {
      if (!open) return null;
      var u = new URL(open.href, location.href);
      try {
        var current = new URL(iframe.contentWindow.location.href);
        if (current.origin === location.origin && current.pathname === u.pathname) u = current;
      } catch (e) {}
      u.searchParams.delete('${EMBED_PARAM}');
      var section = u.searchParams.get('${EMBED_SECTION_PARAM}');
      if (section) u.hash = section;
      u.searchParams.delete('${EMBED_SECTION_PARAM}');
      return u.href;
    }
    bindCopyLink(figure.querySelector('[data-copy-link]'), currentUrl);
    if (open) open.addEventListener('click', function () { open.href = currentUrl(); });
    if (iframe) {
      try {
        var u = new URL(iframe.getAttribute('src'), window.location.href);
        if (u.origin === window.location.origin && u.searchParams.get('${EMBED_PARAM}') === '1' && u.searchParams.get('${THEME_PARAM}') !== theme) {
          u.searchParams.set('${THEME_PARAM}', theme);
          iframe.setAttribute('src', u.pathname + u.search + u.hash);
        }
      } catch (e) {}
    }
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
