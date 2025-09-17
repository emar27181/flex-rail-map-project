import React from 'react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        color: colors.text,
        transition: 'all 0.2s ease',
        boxShadow: `0 2px 4px ${colors.shadow}`,
        minWidth: '120px',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.surfaceElevated;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.surface;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      title={`${theme === 'light' ? 'ダーク' : 'ライト'}モードに切り替え`}
    >
      <span style={{ fontSize: '16px' }}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span>
        {theme === 'light' ? 'ダークモード' : 'ライトモード'}
      </span>
    </button>
  );
};

export default ThemeToggle;