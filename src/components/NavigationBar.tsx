import React from 'react';
import { Sun, Moon, Map, Languages } from 'lucide-react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';

interface NavigationBarProps {
  language: 'japanese' | 'english';
  onLanguageChange: (language: 'japanese' | 'english') => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ language, onLanguageChange }) => {
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: `0 2px 4px ${colors.shadow}`,
      marginBottom: '20px'
    }}>
      {/* ロゴ・タイトル部分 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Map
          size={24}
          color={colors.primary}
          style={{ flexShrink: 0 }}
        />
        <h1 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 'bold',
          color: colors.text
        }}>
          {language === 'japanese' ? '東京路線図' : 'Tokyo Railway Map'}
        </h1>
      </div>

      {/* ナビゲーション項目 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* 言語切り替えボタン */}
        <button
          onClick={() => onLanguageChange(language === 'japanese' ? 'english' : 'japanese')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: colors.text
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.surfaceElevated;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={language === 'japanese' ? 'Switch to English' : 'Switch to Japanese'}
          aria-label={language === 'japanese' ? 'Switch to English' : 'Switch to Japanese'}
        >
          <Languages size={20} />
        </button>

        {/* テーマ切り替えボタン */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: colors.text
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.surfaceElevated;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={language === 'japanese'
            ? `${theme === 'light' ? 'ダーク' : 'ライト'}モードに切り替え`
            : `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`
          }
          aria-label={language === 'japanese'
            ? `${theme === 'light' ? 'ダーク' : 'ライト'}モードに切り替え`
            : `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`
          }
        >
          {theme === 'light' ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;