import React from 'react';
import { getThemeColors } from '../../contexts/ThemeContext';
import { checkboxInput, selectableCard, L} from '../legend/legendStyles';
import { tintColor } from '../../utils/contrast';
import { SEMANTIC, FS} from '../../constants/ui';
import ToggleMark from './atoms/ToggleMark';

interface ToggleableItemProps {
  id: string;
  label: string;
  isActive: boolean;
  isHighlighted?: boolean;
  theme: 'light' | 'dark';
  colorIndicator?: {
    color: string;
    opacity?: number;
  };
  badge?: string;
  inputType?: 'checkbox' | 'radio';
  inputName?: string;
  onToggle: (id: string) => void;
  adjustColorForTheme?: (color: string, theme: 'light' | 'dark') => string;
}

const ToggleableItem: React.FC<ToggleableItemProps> = ({
  id,
  label,
  isActive,
  isHighlighted = false,
  theme,
  colorIndicator,
  badge,
  inputType = 'checkbox',
  inputName,
  onToggle,
  adjustColorForTheme
}) => {
  const colors = getThemeColors(theme);

  return (
    <div
      onClick={() => onToggle(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: L.sp.sm,
        fontSize: FS.caption,
        cursor: 'pointer',
        padding: L.sp.xs,
        // 選択・強調は枠線の太さではなく色と背景で示す。
        // 太さを変えると行の幅と高さが動いて一覧の並びがずれる。
        ...selectableCard(colors, {
          selected: isHighlighted || isActive,
          // 経路に含まれる行は強調色、単に表示ONの行はその路線の色
          accent: isHighlighted ? undefined : colorIndicator?.color,
          radius: '3px',
        }),
        // 強調（経路に含まれる）行は背景をもう少し濃くして区別する
        backgroundColor: isHighlighted
          ? tintColor(colors.primary ?? SEMANTIC.primary, 0.28)
          : isActive
            ? tintColor(colorIndicator?.color ?? colors.primary ?? SEMANTIC.primary, 0.16)
            : colors.surface,
      }}
    >
      <ToggleMark
        type={inputType}
        name={inputName}
        checked={isActive}
        onChange={(e) => {
          e.stopPropagation();
          onToggle(id);
        }}
      />

      {colorIndicator && (
        <div style={{
          width: '20px',
          height: '3px',
          backgroundColor: adjustColorForTheme
            ? adjustColorForTheme(colorIndicator.color, theme)
            : colorIndicator.color,
          marginRight: L.sp.md,
          borderRadius: L.r.control,
          flexShrink: 0,
          opacity: isActive ? (colorIndicator.opacity || 1) : 0.3
        }} />
      )}

      <span style={{
        color: isHighlighted
          ? SEMANTIC.primary
          : isActive
            ? colors.text
            : colors.textMuted,
        lineHeight: '1.2',
        fontWeight: isHighlighted ? 'bold' : 'normal',
        opacity: isActive ? 1 : 0.6,
        // 長い路線名が行幅を押し広げて親コンテナに横スクロールを
        // 発生させていたため、縮小と折り返しを許可する
        minWidth: 0,
        flex: 1,
        overflowWrap: 'anywhere'
      }}>
        {label}
        {badge && (
          <span style={{
            fontSize: FS.caption,
            marginLeft: L.sp.xs,
            color: SEMANTIC.primary,
            fontWeight: 'normal'
          }}>
            ({badge})
          </span>
        )}
      </span>
    </div>
  );
};

export default ToggleableItem;