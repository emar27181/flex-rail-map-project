import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Info } from 'lucide-react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';

interface NavigationBarProps {
  language: 'japanese' | 'english';
  onLanguageChange: (language: 'japanese' | 'english') => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ language, onLanguageChange }) => {
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
        gap: '8px'
      }}>
        {/* Infoボタン */}
        <button
          onClick={() => setIsInfoModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: colors.text,
            padding: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.surfaceElevated;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={language === 'japanese' ? 'このサイトについて' : 'About this site'}
          aria-label={language === 'japanese' ? 'このサイトについて' : 'About this site'}
        >
          <Info size={20} />
        </button>

        {/* 言語切り替えボタン */}
        <button
          onClick={() => onLanguageChange(language === 'japanese' ? 'english' : 'japanese')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: colors.text,
            padding: '6px'
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
            width: '36px',
            height: '36px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: colors.text,
            padding: '6px'
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
            width: '36px',
            height: '36px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: colors.text,
            padding: '6px'
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

      {/* Infoモーダル */}
      {isInfoModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
          onClick={() => setIsInfoModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: colors.surface,
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: `0 8px 32px ${colors.shadow}`,
              border: `1px solid ${colors.border}`,
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 閉じるボタン */}
            <button
              onClick={() => setIsInfoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: colors.textSecondary,
                padding: '4px'
              }}
              aria-label={language === 'japanese' ? '閉じる' : 'Close'}
            >
              <X size={24} />
            </button>

            {/* コンテンツ */}
            <div style={{ paddingRight: '40px' }}>
              <h2 style={{
                margin: '0 0 16px 0',
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.text,
                lineHeight: '1.3'
              }}>
                {language === 'japanese'
                  ? '必要な路線を選んでシンプルに。フレックスに使える新しい路線図。'
                  : 'Choose only the routes you need. A flexible new railway map.'
                }
              </h2>

              <p style={{
                margin: '0 0 24px 0',
                fontSize: '16px',
                lineHeight: '1.6',
                color: colors.text
              }}>
                {language === 'japanese'
                  ? 'Tokyo Flex Railway Map は、東京の複雑な鉄道路線図をもっとシンプルに見やすくするためのサービスです。通常の乗り換えアプリは便利ですが、遅延や運休があると実際には乗れない電車を案内してしまうことがあります。そんなときに路線図を参考にしたくても、ネットで見つかるものは情報が多すぎて読みづらいのが現状です。このサービスでは、必要な路線だけを切り替えて表示できるので、自分にとってわかりやすい路線図をすぐに作れます。「今の電車が正しい方向に進んでいるか」「あと何分で乗り換えか」を直感的に確認でき、東京に不慣れな人でも安心して移動できます。必要な情報だけを抽出した見やすい路線図を参照できるのが特徴です。'
                  : 'Tokyo Flex Railway Map is a service that makes Tokyo\'s complex railway map simple and easy to read. Regular route planner apps are useful, but they sometimes suggest trains that are delayed or not running. Existing online railway maps contain too much information and are difficult to read. With this service, you can switch on and off only the routes you need, creating a custom simplified map that fits your situation. You can quickly check if your train is heading in the right direction or estimate how many minutes remain until your transfer. Even if you\'re not familiar with Tokyo, this tool helps you travel with confidence.'
                }
              </p>

              {/* 作者情報 */}
              <div style={{
                borderTop: `1px solid ${colors.borderLight}`,
                paddingTop: '16px',
                fontSize: '14px',
                color: colors.textSecondary
              }}>
                Developed by{' '}
                <a
                  href="https://github.com/emar27181"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: colors.primary,
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  ema | GitHub: emar27181
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;