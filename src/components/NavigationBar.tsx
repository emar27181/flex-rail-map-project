import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';

interface NavigationBarProps {
  language: 'japanese' | 'english';
  onLanguageChange: (language: 'japanese' | 'english') => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ language, onLanguageChange }) => {
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 20px',
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: `0 2px 4px ${colors.shadow}`,
      marginBottom: '20px',
      position: 'relative'
    }}>
      {/* ロゴ・タイトル部分 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <img
          src="/icon_flex_rail_way_map.png"
          alt="Tokyo Flex Railway Map Logo"
          style={{
            width: '32px',
            height: '32px',
            flexShrink: 0,
            borderRadius: '4px'
          }}
        />
        <h1 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 'bold',
          color: colors.text
        }}>
          {language === 'japanese' ? '東京フレックス路線図' : 'Tokyo Flex Railway Map'}
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
          <span style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: colors.text,
            fontFamily: 'monospace'
          }}>
            {language === 'japanese' ? 'En' : '日'}
          </span>
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

        {/* ハンバーガーメニューボタン */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          title={language === 'japanese' ? 'メニュー' : 'Menu'}
          aria-label={language === 'japanese' ? 'メニューを開く' : 'Open menu'}
        >
          {isMenuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>

      {/* ドロップダウンメニュー */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '20px',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          boxShadow: `0 4px 12px ${colors.shadow}`,
          zIndex: 1000,
          minWidth: '200px',
          padding: '8px 0'
        }}>
          <div
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              color: colors.text,
              borderBottom: `1px solid ${colors.borderLight}`
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceElevated}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              console.log('About clicked');
              setIsMenuOpen(false);
            }}
          >
            {language === 'japanese' ? 'このサイトについて' : 'About'}
          </div>
          <div
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              color: colors.text,
              borderBottom: `1px solid ${colors.borderLight}`
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceElevated}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              console.log('Help clicked');
              setIsMenuOpen(false);
            }}
          >
            {language === 'japanese' ? 'ヘルプ' : 'Help'}
          </div>
          <div
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              color: colors.text
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceElevated}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => {
              window.open('https://github.com/anthropics/claude-code', '_blank');
              setIsMenuOpen(false);
            }}
          >
            {language === 'japanese' ? 'Claude Code で作成' : 'Made with Claude Code'}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;