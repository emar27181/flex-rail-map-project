import React from 'react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';

interface ThemeToggleProps {
  language?: Language;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ language = 'japanese' }) => {
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
      title={translateUI(theme === 'light' ? 'switchToDarkMode' : 'switchToLightMode', language)}
    >
      <span style={{ fontSize: '16px' }}>
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span>
        {translateUI(theme === 'light' ? 'darkMode' : 'lightMode', language)}
      </span>
    </button>
  );
};

export default ThemeToggle;