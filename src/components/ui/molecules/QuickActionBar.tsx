import React from 'react';
import { getThemeColors } from '../../../contexts/ThemeContext';
import { L } from '../../legend/legendStyles';

export interface QuickAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface QuickActionBarProps {
  actions: QuickAction[];
  theme: 'light' | 'dark';
}

const QuickActionBar: React.FC<QuickActionBarProps> = ({ actions, theme }) => {
  const colors = getThemeColors(theme);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: L.sp.sm, flexWrap: 'wrap' }}>
      {actions.map(action => (
        <button
          key={action.key}
          type="button"
          aria-pressed={action.pressed}
          disabled={action.disabled}
          onClick={action.onClick}
          style={{
            minHeight: 36,
            padding: `0 ${L.sp.lg}`,
            borderRadius: 999,
            border: `1px solid ${action.pressed ? colors.primary : colors.border}`,
            background: action.pressed ? colors.surface : colors.glassOpen,
            color: action.pressed ? colors.primary : colors.text,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: L.sp.sm,
            font: 'inherit',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            cursor: action.disabled ? 'default' : 'pointer',
            opacity: action.disabled ? 0.45 : 1,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span aria-hidden style={{ display: 'flex', alignItems: 'center' }}>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionBar;
