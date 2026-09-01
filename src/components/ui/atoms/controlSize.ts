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
    fontSize: FS.helper,
    radius: L.r.md,
    gap: L.sp.xs,
  },
  md: {
    minHeight: TARGET.touch,
    padding: `0 ${L.sp.lg}`,
    fontSize: FS.label,
    radius: L.r.md,
    gap: L.sp.sm,
  },
};

/**
 * 枠線の太さ。状態（選択・非選択）で変えてはいけない。
 * 太さを変えると押すたびに外形が動いて、並んだ部品がずれる。
 */
export const CONTROL_BORDER_WIDTH = 1;
