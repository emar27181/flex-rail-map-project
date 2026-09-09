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
}

export const CONTROL_SIZE: Record<ControlSize, ControlSizeSpec> = {
  sm: {
    minHeight: TARGET.min,
    padding: `0 ${L.sp.md}`,
    fontSize: FS.caption,
    radius: L.r.control,
    gap: L.sp.xs,
  },
  md: {
    minHeight: TARGET.touch,
    padding: `0 ${L.sp.lg}`,
    // 大きいほうは文字も一段上げる。同じ文字で高さだけ違うと間延びして見える
    fontSize: FS.body,
    radius: L.r.control,
    gap: L.sp.sm,
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
