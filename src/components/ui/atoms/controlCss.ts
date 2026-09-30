/**
 * 静的ページ（.astro）の操作部品のCSS。React のアトム（IconButton ほか）と同じ
 * 規格（controlSize.ts）から作る。
 *
 * 記事・ガイドのヘッダーには React を読み込まないため、アトムを直接使えない。
 * 以前は記事のテーマボタン（34px・角丸8px）と言語切り替え（角丸3px・別の余白）が
 * それぞれ独自の値を持っていて、並べると形が揃っていなかった。
 * ここのクラスを付けるだけにし、寸法を各ページ・各部品に書かない。
 *
 * 寸法は地図の隅のボタン（RailwayMap の renderCornerButton）と同じ
 * FLOATING_ICON_BUTTON_SIZE.md・FLOATING_ICON_GLYPH_SIZE。サイトのどこでもヘッダーの
 * ボタンが同じ大きさ・同じ角丸になる。
 *
 * - `.ctl`      : 操作部品の土台（高さ・余白・文字・角丸・枠線）
 * - `.ctl-icon` : アイコンだけの正方形ボタン
 *
 * 色は各レイアウトが CSS 変数で渡す（記事とガイドで配色の系統が違うため）:
 * `--ctl-fg`（文字）/ `--ctl-bg`（背景）/ `--ctl-border`（枠）/ `--ctl-accent`（ホバー）。
 */
import {
  CONTROL_BORDER_WIDTH, CONTROL_SIZE, FLOATING_ICON_BUTTON_SIZE, FLOATING_ICON_GLYPH_SIZE,
} from './controlSize';
import { L } from '../../legend/legendStyles';

/** ヘッダーに並ぶ操作の高さ(px)。同じ行の部品は必ずこれにそろえる */
export const HEADER_CONTROL_PX = FLOATING_ICON_BUTTON_SIZE.md;
/** ヘッダーのロゴ（アプリのアイコン）の大きさ(px)。ボタンより一段小さい sm 段階 */
export const HEADER_LOGO_PX = FLOATING_ICON_BUTTON_SIZE.sm;

const md = CONTROL_SIZE.md;

/**
 * デザイントークンの CSS 変数。手書きの CSS（記事の src/styles/article-*.css）は TS の
 * トークンを import できないため、角の丸み・操作部品の寸法はこの変数だけを使う
 * （tests/unit/styles/articleCssTokens.test.ts が直書きを検出する）。
 *
 * - 角の丸みは役割で選ぶ: --r-control（ボタン・チップ・入力など操作部品）/
 *   --r-card（表・囲み・カードなど部品を載せる箱）/ --r-pill（件数・タグなどのバッジ）
 * - 操作部品の寸法は React のアトムと同じ CONTROL_SIZE の md（指で押すもの）
 */
export const TOKEN_VARS_CSS = `
:root {
  --r-control: ${L.r.control};
  --r-card: ${L.r.card};
  --r-pill: ${L.r.pill};
  --ctl-md-h: ${CONTROL_SIZE.md.minHeight}px;
  --ctl-md-pad: ${CONTROL_SIZE.md.padding};
  --ctl-md-fs: ${CONTROL_SIZE.md.fontSize};
  --ctl-md-gap: ${CONTROL_SIZE.md.gap};
  --ctl-border-w: ${CONTROL_BORDER_WIDTH}px;
}
`;

export const CONTROL_CSS = TOKEN_VARS_CSS + `
.ctl {
  box-sizing: border-box;
  display: inline-flex; align-items: center; justify-content: center; gap: ${md.gap};
  height: ${HEADER_CONTROL_PX}px; padding: ${CONTROL_SIZE.sm.padding};
  font: inherit; font-size: ${md.fontSize}; line-height: 1; white-space: nowrap;
  border: ${CONTROL_BORDER_WIDTH}px solid var(--ctl-border, currentColor);
  border-radius: ${md.radius};
  background: var(--ctl-bg, transparent); color: var(--ctl-fg, inherit);
  cursor: pointer; user-select: none; text-decoration: none;
}
.ctl:hover { color: var(--ctl-accent, inherit); border-color: var(--ctl-accent, currentColor); }
.ctl:focus-visible { outline: 2px solid var(--ctl-accent, currentColor); outline-offset: 2px; }
.ctl svg { width: ${FLOATING_ICON_GLYPH_SIZE}px; height: ${FLOATING_ICON_GLYPH_SIZE}px; flex: none; }
.ctl-icon { width: ${HEADER_CONTROL_PX}px; padding: 0; }
`;
