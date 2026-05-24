import React, { useState, useEffect } from 'react';
import { Cookie, Settings, X } from 'lucide-react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';

interface CookieBannerProps {
  language: 'japanese' | 'english';
}

const CookieBanner: React.FC<CookieBannerProps> = ({ language }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: true,
    advertising: true
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    } else {
      const preferences = JSON.parse(consent);
      setCookiePreferences(preferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = {
      necessary: true,
      analytics: true,
      advertising: true
    };
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setCookiePreferences(preferences);
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleReject = () => {
    const preferences = {
      necessary: true,
      analytics: false,
      advertising: false
    };
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setCookiePreferences(preferences);
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderBottom: 'none',
        boxShadow: `0 -4px 12px ${colors.shadow}`,
        zIndex: 10000,
        padding: '20px',
        maxHeight: '50vh',
        overflowY: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <Cookie size={24} color={colors.primary} style={{ flexShrink: 0, marginTop: '2px' }} />

          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: 'bold',
              color: colors.text
            }}>
              {language === 'japanese' ? 'Cookieの使用について' : 'Cookie Usage'}
            </h3>
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              lineHeight: '1.5',
              color: colors.textSecondary
            }}>
              {language === 'japanese'
                ? 'このサイトでは、サービス向上および広告配信のため、利用状況に基づくCookieを使用しています。詳細は'
                : 'This site uses cookies for ads and analytics based on usage data to improve our services. For details, see our'
              }
              <a
                href="/privacy"
                style={{
                  color: colors.primary,
                  textDecoration: 'none',
                  margin: '0 4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {language === 'japanese' ? 'プライバシーポリシー' : 'Privacy Policy'}
              </a>
              {language === 'japanese' ? 'をご覧ください。' : '.'}
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <button
                onClick={handleAcceptAll}
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {language === 'japanese' ? 'すべて同意' : 'Accept All'}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  backgroundColor: 'transparent',
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surfaceElevated;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Settings size={16} />
                {language === 'japanese' ? '設定管理' : 'Manage Settings'}
              </button>

              <button
                onClick={handleReject}
                style={{
                  backgroundColor: 'transparent',
                  color: colors.textSecondary,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surfaceElevated;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {language === 'japanese' ? '必要なもののみ' : 'Essential Only'}
              </button>
            </div>
          </div>
        </div>

        {/* Cookie Settings Panel */}
        {showSettings && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: colors.surfaceElevated,
            borderRadius: '8px',
            border: `1px solid ${colors.borderLight}`
          }}>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 'bold',
              color: colors.text
            }}>
              {language === 'japanese' ? 'Cookie設定' : 'Cookie Settings'}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Necessary Cookies */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <h5 style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.text
                  }}>
                    {language === 'japanese' ? '必要なCookie' : 'Necessary Cookies'}
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: colors.textSecondary,
                    lineHeight: '1.4'
                  }}>
                    {language === 'japanese'
                      ? 'サイトの基本機能に必要なCookieです（テーマ設定、言語設定など）'
                      : 'Essential cookies for basic site functionality (theme settings, language preferences, etc.)'
                    }
                  </p>
                </div>
                <div style={{
                  backgroundColor: colors.textSecondary,
                  borderRadius: '12px',
                  padding: '2px',
                  width: '44px',
                  height: '24px',
                  position: 'relative',
                  opacity: 0.5
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    right: '2px',
                    top: '2px'
                  }} />
                  <span style={{
                    position: 'absolute',
                    right: '28px',
                    top: '0',
                    fontSize: '10px',
                    color: colors.background,
                    lineHeight: '24px',
                    fontWeight: 'bold'
                  }}>
                    ON
                  </span>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <h5 style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.text
                  }}>
                    {language === 'japanese' ? '分析Cookie' : 'Analytics Cookies'}
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: colors.textSecondary,
                    lineHeight: '1.4'
                  }}>
                    {language === 'japanese'
                      ? 'Google Analyticsによるサイト利用状況の分析に使用されます'
                      : 'Used by Google Analytics to analyze site usage patterns'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setCookiePreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                  style={{
                    backgroundColor: cookiePreferences.analytics ? colors.primary : colors.textSecondary,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '2px',
                    width: '44px',
                    height: '24px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    left: cookiePreferences.analytics ? '22px' : '2px',
                    top: '2px',
                    transition: 'left 0.2s ease'
                  }} />
                  <span style={{
                    position: 'absolute',
                    left: cookiePreferences.analytics ? '6px' : '28px',
                    top: '0',
                    fontSize: '10px',
                    color: 'white',
                    lineHeight: '24px',
                    fontWeight: 'bold'
                  }}>
                    {cookiePreferences.analytics ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

              {/* Advertising Cookies */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <h5 style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.text
                  }}>
                    {language === 'japanese' ? '広告Cookie' : 'Advertising Cookies'}
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: colors.textSecondary,
                    lineHeight: '1.4'
                  }}>
                    {language === 'japanese'
                      ? 'Google AdSenseによる適切な広告配信に使用されます'
                      : 'Used by Google AdSense for appropriate ad delivery'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setCookiePreferences(prev => ({ ...prev, advertising: !prev.advertising }))}
                  style={{
                    backgroundColor: cookiePreferences.advertising ? colors.primary : colors.textSecondary,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '2px',
                    width: '44px',
                    height: '24px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    left: cookiePreferences.advertising ? '22px' : '2px',
                    top: '2px',
                    transition: 'left 0.2s ease'
                  }} />
                  <span style={{
                    position: 'absolute',
                    left: cookiePreferences.advertising ? '6px' : '28px',
                    top: '0',
                    fontSize: '10px',
                    color: 'white',
                    lineHeight: '24px',
                    fontWeight: 'bold'
                  }}>
                    {cookiePreferences.advertising ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: colors.textSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceElevated}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {language === 'japanese' ? 'キャンセル' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveSettings}
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {language === 'japanese' ? '設定を保存' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CookieBanner;