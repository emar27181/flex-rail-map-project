/**
 * 操作部品（ボタン・チップ・入力欄）の大きさの規格。
 *
 * 高さ・文字サイズ・左右の余白・角丸をここ1箇所で決める。
 * ボタンだけ44px、チップだけ44pxで文字だけ13px、といった食い違いが
 * 実際に起きていたため、部品ごとに書かずに必ずここから取る。
 *
 * 2段階しか持たない。迷ったら md を使う。
 * - md: 指で押すもの（Apple HIG の 44pt）。パネルの主要な操作はこちら
 * - sm: 補助的な操作（WCAG 2.2 AA 2.5.8 の下限 24px）。密なヘッダーなど
 *
 * 同じ行・同じグループに並ぶ操作は必ず同じ段階にすること。
 * 隣り合う部品で高さが違うのが「揃っていない」の主な原因だった。
 */
import { FS, TARGET } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';

export type ControlSize = 'sm' | 'md';

export interface ControlSizeSpec {
  /** 最小の高さ(px) */
  minHeight: number;
  /** 左右の余白 */
  padding: string;
  /** 文字サイズ */
  fontSize: string;
  /** 角丸 */
  radius: string;
  /** アイコンと文字のあいだ */
  gap: string;
  /** lucide-react アイコンの大きさ(px)。Button/IconButtonが既定値として使う */
  iconSize: number;
}

export const CONTROL_SIZE: Record<ControlSize, ControlSizeSpec> = {
  sm: {
    minHeight: TARGET.min,
    padding: `0 ${L.sp.md}`,
    fontSize: FS.caption,
    radius: L.r.control,
    gap: L.sp.xs,
    iconSize: 14,
  },
  md: {
    minHeight: TARGET.touch,
    padding: `0 ${L.sp.lg}`,
    // 大きいほうは文字も一段上げる。同じ文字で高さだけ違うと間延びして見える
    fontSize: FS.body,
    radius: L.r.control,
    gap: L.sp.sm,
    iconSize: 16,
  },
};

/**
 * 枠線の太さ。状態（選択・非選択）で変えてはいけない。
 * 太さを変えると押すたびに外形が動いて、並んだ部品がずれる。
 */
export const CONTROL_BORDER_WIDTH = 1;

/**
 * 単体で浮かぶ丸いアイコンボタン（フルスクリーン切り替え・言語・テーマなど、
 * 地図の隅に浮かせて置くもの）だけの大きさの規格。
 *
 * ボタン・入力欄・チップの `CONTROL_SIZE` とは別の尺度。あちらは
 * 「同じ行に並ぶ部品を必ず2段階のどちらかに揃える」ためのもので、
 * 段階を増やすと「どれを使うか」が決まらなくなるため意図的に2つだけに
 * 絞っている。一方こちらは他の部品と行を揃える必要のない、単体で置く
 * アイコンボタン専用の尺度なので、置き場所の余白や操作の重要度に応じて
 * 3段階から選べるようにする。
 *
 * - sm(24px): WCAG 2.2 AA 2.5.8 の絶対下限。込み合った場所・補助的な操作
 * - md(36px): 既定。地図の隅に浮かぶ操作ボタンの標準的な大きさ
 * - lg(44px): Apple HIG の推奨最小値。指で何度も押す主要操作向け
 *
 * `IconButton` / `LinkButton` 自体の `size` prop（`ControlSize`）は
 * このスケールを直接は受け取れない。ここから取った値を
 * `styleOverride={{ width, height }}` で渡して使う
 * （角丸・文字色などの見た目はアトム側の既定のまま変わらない）。
 */
export const FLOATING_ICON_BUTTON_SIZE = {
  sm: TARGET.min,
  md: 36,
  lg: TARGET.touch,
} as const;

export type FloatingIconButtonSize = keyof typeof FLOATING_ICON_BUTTON_SIZE;

/**
 * 地図の上に浮かぶ操作とパネル（隅の丸いボタン・「表示切替」・凡例「N路線」・駅選択・
 * 表示路線の切替・下から開くパネル）の高さ・文字の大きさ・角の丸み。
 * 隣り合って並ぶので、ここ1か所で決める。
 * - 以前は凡例の見出しだけパネルの見出しの大きさ（FS.title）で、「表示切替」より文字が大きかった
 * - 角の丸みも、ボタンは3px・凡例と駅選択は8px・表示路線の切替は3px・下のパネルは12pxとばらばらだった。
 *   浮かぶものは「部品を載せる箱」として card(8px) にそろえる。丸みを変えるときはここだけ直す
 */
export const FLOATING_CONTROL = {
  height: FLOATING_ICON_BUTTON_SIZE.md,
  fontSize: CONTROL_SIZE.md.fontSize,
  radius: L.r.card,
} as const;

/**
 * 地図の上に浮かぶ開閉パネル（CollapsiblePanel: 凡例「N路線」・立体表示の説明など）の寸法。
 * 幅・高さの上限・地図の端との間・浮かぶ部品どうしの間をここ1か所で決める。
 * 以前は凡例が 168px、立体表示の箱が 360px と高さの上限 `min(60vh, 420px)` を各ファイルに直書きしていた。
 * - width.narrow: 一覧（チップを縦に並べる）。地図を覆いすぎない幅
 * - width.wide: 説明と操作（文章・Stepper・チェックボックス）を入れる幅
 * - maxHeight: 開いたときの高さの上限（中はスクロール）。スマホで地図が隠れすぎないように
 */
export const FLOATING_PANEL = {
  width: { narrow: 168, wide: 360 },
  maxHeight: 'min(60vh, 420px)',
  /** 地図の端からの距離 */
  inset: L.sp.lg,
  /** 浮かぶ部品どうしの間（ボタンの列とパネルの間など） */
  gap: L.sp.sm,
} as const;

export type FloatingPanelWidth = keyof typeof FLOATING_PANEL.width;

/** パネルの幅。狭い画面では地図の左右の端との間（inset）を残して縮む */
export const floatingPanelWidth = (w: FloatingPanelWidth) =>
  `min(${FLOATING_PANEL.width[w]}px, calc(100% - 2 * ${FLOATING_PANEL.inset}))`;

/**
 * 地図の隅の丸いボタン（FLOATING_ICON_BUTTON_SIZE.md）が rows 段並んでいる所の、すぐ上の位置（下端からの距離）。
 * 左下の「縮小・方位・言語」の上にパネルを置くときに使う
 */
export const aboveFloatingButtons = (rows = 1) =>
  `calc(${FLOATING_PANEL.inset} + ${rows} * (${FLOATING_ICON_BUTTON_SIZE.md}px + ${FLOATING_PANEL.gap}))`;

/**
 * 浮かせたアイコンボタン（地図の隅・記事ヘッダー）の中のアイコンの大きさ(px)。
 * FLOATING_ICON_BUTTON_SIZE.md（36px）の箱に対して詰まりすぎない大きさ。
 */
export const FLOATING_ICON_GLYPH_SIZE = 18;
