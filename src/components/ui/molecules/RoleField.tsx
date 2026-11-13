/**
 * 役割の色で塗った入力欄（モレキュール）。出発=緑・到着=赤（SEMANTIC.departure / arrival）。
 *
 * 出発駅・到着駅・「集合駅を探す」で増やす出発駅は、どれも**同じ部品**で描く。以前は出発欄と到着欄が同じ形の入力欄を
 * 2回手書きしていて、追加の出発駅は別の見た目（灰色のタグ・点線の枠）になっていた（2026-11-13: 「別の出発駅でも色は同じで」）。
 * 役割の色・白い文字・クリアボタンの置き方はここ1か所。
 *
 * - 入力欄はアトム TextField、クリアはアトム IconButton。枠も塗りも役割の色（状態で太さを変えない）
 * - 先頭にアイコン（＋など）を置ける（adornment）。クリアは値があるときだけ（onClear を渡したとき）
 * - 入力欄の props（value・onChange・placeholder など）はそのまま渡せる
 *
 * 駅のことは知らない（何を入れる欄かは呼び出し側が決める）。
 */
import React from 'react';
import { X } from 'lucide-react';
import TextField from '../atoms/TextField';
import IconButton from '../atoms/IconButton';
import { CONTROL_SIZE } from '../atoms/controlSize';
import type { ControlSize } from '../atoms/controlSize';
import type { TextFieldProps } from '../atoms/TextField';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { SEMANTIC, alphaWhite } from '../../../constants/ui';
import { L } from '../../legend/legendStyles';

export type FieldRole = 'departure' | 'arrival';

/** 役割の色の定義元（直書きしない）。塗りも枠も同じ色 */
export const ROLE_FIELD_COLOR: Record<FieldRole, string> = {
  departure: SEMANTIC.departure,
  arrival: SEMANTIC.arrival,
};

export interface RoleFieldProps extends Omit<TextFieldProps, 'size' | 'className' | 'styleOverride' | 'fullWidth'> {
  role: FieldRole;
  size?: ControlSize;
  /** 値を消すボタン。渡したときだけ右端に出す */
  onClear?: () => void;
  /** 消すボタンの読み上げ用ラベル */
  clearLabel?: string;
  /** 先頭に置くアイコン（「＋」など）。文字と重ならない余白を取る */
  adornment?: React.ReactNode;
  /** 入力欄を囲む要素に付ける data 属性（テスト・計測用） */
  wrapperAttr?: Record<`data-${string}`, string | boolean | undefined>;
}

/** 塗りの入力欄の目印のクラス。白いプレースホルダ・白い文字の CSS（pages/index.astro）が、このクラスに付く */
export const ROLE_FIELD_CLASS = 'station-input-filled';

const RoleField = React.forwardRef<HTMLInputElement, RoleFieldProps>(({
  role, size = 'sm', onClear, clearLabel, adornment, wrapperAttr, theme, ...rest
}, ref) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];
  const color = ROLE_FIELD_COLOR[role];
  return (
    <div style={{ position: 'relative' }} {...wrapperAttr}>
      {adornment && (
        <span
          aria-hidden
          style={{ position: 'absolute', left: L.sp.md, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: colors.onPrimary, pointerEvents: 'none' }}
        >
          {adornment}
        </span>
      )}
      <TextField
        {...rest}
        ref={ref}
        theme={theme}
        size={size}
        fullWidth
        className={ROLE_FIELD_CLASS}
        styleOverride={{
          // ✕ を重ねるときだけ右側の余白を広げる（値が無いうちは案内の文字に幅を使う。
          // 英語の "Enter station name" が狭い画面で切れていた, 2026-10-15）
          ...(onClear ? { paddingRight: L.sp['3xl'] } : {}),
          ...(adornment ? { paddingLeft: `calc(${L.sp.md} + ${dims.iconSize}px + ${L.sp.xs})` } : {}),
          // 役割の色で塗りつぶし、文字は白。地図の上でも役割が一目で分かるようにする
          border: `2px solid ${color}`,
          backgroundColor: color,
          color: colors.onPrimary,
        }}
      />
      {onClear && (
        <IconButton
          theme={theme}
          size="sm"
          onClick={onClear}
          label={clearLabel ?? ''}
          icon={<X size={14} />}
          styleOverride={{
            position: 'absolute',
            right: '2px',
            top: '50%',
            transform: 'translateY(-50%)',
            // 塗りつぶした入力欄の上に置くため白系にする
            color: alphaWhite(0.9),
          }}
        />
      )}
    </div>
  );
});
RoleField.displayName = 'RoleField';

export default RoleField;
