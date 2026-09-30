/**
 * 表（静的ページの表・記事の表）の規格。スマホ・タブレット・PC で見せ方を変える。
 *
 * 以前は駅・路線・データのページと記事で表の書き方がばらばらで、スマホでは
 * 「駅名の列が1文字ずつ縦に並ぶ」（長い「乗り換え」の列に幅を取られる）ことがあった。
 * 表の見せ方はここだけで決め、ページ側は列の種類を指定するだけにする。
 *
 * 列の種類（ColumnKind）:
 * - `title`: その行の名前（駅名・路線名）。折り返さない。スマホではカードの見出し
 * - `index`: 順番・順位。狭く右寄せ。スマホでは見出しの前に小さく
 * - `num`  : 数値。右寄せ・桁をそろえる・折り返さない
 * - `text` : 長くなりうる文章（乗り換え路線の一覧など）。折り返す
 * - `note` : 補足（範囲・時期など）。小さく控えめ
 *
 * 端末ごとの見せ方（区分は src/constants/breakpoints.ts）:
 * - PC・タブレット: ふつうの表。マウスのときだけ行にホバーの色を付ける
 * - スマホ: 1行を1枚のカードにする（見出し＝title、ほかは「列名: 値」の行）。空の欄は出さない。
 *   列見出しは画面には出さないが、読み上げのために残す
 *
 * 色は各レイアウトが CSS 変数で渡す: `--rt-border`（区切り線）/ `--rt-muted`（列名・補足の文字）/
 *  `--rt-hover`（ホバーの背景）/ `--rt-pad-x`（スマホのカードの左右の余白。枠のある表だけ）。Astro では ResponsiveTable.astro / TableCell.astro を、
 * HTML 文字列を作る所（記事）では responsiveTableHtml() を使う。
 */
import { FS } from '../../../constants/ui';
import { MEDIA } from '../../../constants/breakpoints';
import { L } from '../../legend/legendStyles';

export type ColumnKind = 'title' | 'index' | 'num' | 'text' | 'note';

export interface TableColumn {
  label: string;
  kind?: ColumnKind;
  /** 列見出しをリンクにする（その指標のページなど） */
  href?: string;
}

/** クラス名（CSS と Astro コンポーネントと HTML 文字列で同じものを使う） */
export const RT_CLASS = {
  wrap: 'rtable-wrap',
  table: 'rtable',
  cell: (kind: ColumnKind = 'text') => `rt-${kind}`,
} as const;

const esc = (s: string) => s.replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');

/** 表の HTML（記事など、文字列で本文を作る所から使う）。セルの中身は HTML として入れる */
export function responsiveTableHtml(columns: TableColumn[], rows: string[][]): string {
  const head = columns.map(c => `<th class="${RT_CLASS.cell(c.kind)}" scope="col">${c.href ? `<a href="${esc(c.href)}">${c.label}</a>` : c.label}</th>`).join('');
  const body = rows.map(r => `<tr>${r.map((cell, i) => {
    const c = columns[i] ?? { label: '' };
    const empty = cell.trim() === '' ? ' data-empty' : '';
    return `<td class="${RT_CLASS.cell(c.kind)}" data-label="${esc(c.label)}"${empty}>${cell}</td>`;
  }).join('')}</tr>`).join('');
  return `<div class="${RT_CLASS.wrap}"><table class="${RT_CLASS.table}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

const t = `.${RT_CLASS.table}`;
const other = `td:not(.rt-title):not(.rt-index)`;

export const RESPONSIVE_TABLE_CSS = `
.${RT_CLASS.wrap} { overflow-x: auto; margin: ${L.sp.md} 0 ${L.sp['2xl']}; }
${t} { width: 100%; border-collapse: collapse; font-size: ${FS.body}; }
${t} th, ${t} td {
  text-align: left; vertical-align: top;
  padding: ${L.sp.sm} ${L.sp.md};
  border-bottom: 1px solid var(--rt-border, currentColor);
}
${t} th { font-weight: bold; color: var(--rt-muted, inherit); white-space: nowrap; }
${t} .rt-title { white-space: nowrap; }
${t} .rt-index { width: 1%; text-align: right; white-space: nowrap; color: var(--rt-muted, inherit); }
${t} .rt-num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
${t} .rt-note { color: var(--rt-muted, inherit); font-size: ${FS.caption}; }

@media ${MEDIA.mouse} {
  ${t} tbody tr:hover { background: var(--rt-hover, transparent); }
}

@media ${MEDIA.mobile} {
  .${RT_CLASS.wrap} { overflow-x: visible; }
  ${t}, ${t} tbody, ${t} tr, ${t} td { display: block; width: auto; }
  /* 列見出しは画面から隠し、読み上げには残す */
  ${t} thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  ${t} tr {
    display: flex; flex-wrap: wrap; align-items: baseline; gap: ${L.sp.xs} ${L.sp.sm};
    padding: ${L.sp.md} var(--rt-pad-x, 0); border-bottom: 1px solid var(--rt-border, currentColor);
  }
  ${t} td { border: 0; padding: 0; }
  ${t} .rt-index { width: auto; order: 0; }
  ${t} .rt-index::after { content: "."; }
  ${t} .rt-title { order: 1; flex: 1 1 auto; font-weight: bold; font-size: ${FS.input}; white-space: normal; }
  ${t} ${other} {
    order: 2; flex: 1 1 100%;
    display: flex; justify-content: space-between; align-items: baseline; gap: ${L.sp.md};
    text-align: right; white-space: normal;
  }
  ${t} ${other}::before { content: attr(data-label); flex: none; text-align: left; color: var(--rt-muted, inherit); font-size: ${FS.caption}; }
  /* 文章・補足は長くなるので、列名を上・値を下に左寄せで並べる（数値だけ「列名 … 値」の1行） */
  ${t} td.rt-text:not([data-empty]), ${t} td.rt-note:not([data-empty]) { display: block; text-align: left; }
  ${t} td.rt-text::before, ${t} td.rt-note::before { display: block; }
  /* 空の欄は出さない（上の display: flex より強い指定にする） */
  ${t} ${other}[data-empty] { display: none; }
}
`;
