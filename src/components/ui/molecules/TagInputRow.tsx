/**
 * 選んだものをタグで横に並べ、同じ1行の末尾に「＋ 追加」の入力欄を置く行（モレキュール）。
 *
 * 人数・件数に合わせて増減する入力（集合駅を探すモードの出発駅など）に使う。
 * - タグ（アトム RemovableTag）は番号・名前を1つの文にまとめて横一列に並べる。行ごとに見出しを立てない
 * - 末尾の入力欄（アトム TextField）は**いつでも出ている**。ボタンで開く手間がない。枠は普通の入力欄と同じ
 *   （点線や色付きの枠にしない）。左に ＋ のアイコン
 * - 1行に収まらなければ折り返し、入力欄は次の行で残りの幅いっぱいに広がる。最小の幅は `TAG_INPUT_MIN_WIDTH_EM`
 * - 候補の一覧などの重ねる部品は children に渡す（入力欄の下に出す）
 *
 * 何を選ぶか（駅・路線など）は知らない。ラベル・候補・追加の処理は呼び出し側（organism）が決める。
 */
import React from 'react';
import { Plus } from 'lucide-react';
import RemovableTag from '../atoms/RemovableTag';
import TextField from '../atoms/TextField';
import { CONTROL_SIZE, TAG_INPUT_MIN_WIDTH_EM } from '../atoms/controlSize';
import type { ControlSize } from '../atoms/controlSize';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { L } from '../../legend/legendStyles';

export interface TagInputRowTag {
  id: string;
  label: string;
}

export interface TagInputRowProps {
  theme: 'light' | 'dark';
  tags: TagInputRowTag[];
  onRemove: (id: string) => void;
  /** 削除ボタンの読み上げ用ラベル */
  removeLabel: string;
  /** 末尾の入力欄 */
  inputValue: string;
  onInputChange: (value: string, target: HTMLInputElement) => void;
  onInputFocus?: (target: HTMLInputElement) => void;
  onInputBlur?: () => void;
  /** 案内の文字（「出発駅を追加」）。読み上げの名前にも使う */
  placeholder: string;
  size?: ControlSize;
  /** 候補の一覧など、入力欄の下に重ねるもの */
  children?: React.ReactNode;
  /** 行全体・入力欄を指す data 属性（テスト・計測用） */
  rowAttr?: Record<`data-${string}`, string | boolean | undefined>;
  inputAttr?: Record<`data-${string}`, string | boolean | undefined>;
}

const TagInputRow: React.FC<TagInputRowProps> = ({
  theme, tags, onRemove, removeLabel, inputValue, onInputChange, onInputFocus, onInputBlur, placeholder,
  size = 'sm', children, rowAttr, inputAttr,
}) => {
  const colors = getThemeColors(theme);
  const dims = CONTROL_SIZE[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: L.sp.xs }} {...rowAttr}>
      {tags.map(tag => (
        <span key={tag.id} data-tag-item>
          <RemovableTag theme={theme} size={size} label={tag.label} onRemove={() => onRemove(tag.id)} removeLabel={removeLabel} />
        </span>
      ))}
      <div
        {...inputAttr}
        style={{ flex: `1 1 ${TAG_INPUT_MIN_WIDTH_EM}em`, minWidth: 0, position: 'relative', fontSize: dims.fontSize }}
      >
        <Plus
          size={dims.iconSize}
          aria-hidden
          style={{ position: 'absolute', left: L.sp.md, top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary, pointerEvents: 'none' }}
        />
        <TextField
          theme={theme}
          size={size}
          type="text"
          fullWidth
          value={inputValue}
          onChange={e => onInputChange(e.target.value, e.currentTarget)}
          onFocus={e => onInputFocus?.(e.currentTarget)}
          onBlur={() => onInputBlur?.()}
          placeholder={placeholder}
          aria-label={placeholder}
          styleOverride={{ paddingLeft: `calc(${L.sp.md} + ${dims.iconSize}px + ${L.sp.xs})` }}
        />
        {children}
      </div>
    </div>
  );
};

export default TagInputRow;
