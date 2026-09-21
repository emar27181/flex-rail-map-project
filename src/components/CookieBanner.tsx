import React, { useState, useEffect } from 'react';
import { Cookie, Settings, X } from 'lucide-react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import Button from './ui/atoms/Button';
import Switch from './ui/atoms/Switch';
import { translateUI } from '../utils/translation';
import type { Language } from '../utils/translation';
import { FS } from '../constants/ui';
import { L } from './legend/legendStyles';
import { updateAnalyticsConsent } from '../utils/gtagConsent';

interface CookieBannerProps {
  language: Language;
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
    updateAnalyticsConsent(preferences.analytics);
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    updateAnalyticsConsent(cookiePreferences.analytics);
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
    updateAnalyticsConsent(preferences.analytics);
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
        padding: L.sp['3xl'],
        maxHeight: '50vh',
        overflowY: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: L.sp['2xl'],
          flexWrap: 'wrap'
        }}>
          <Cookie size={24} color={colors.primary} style={{ flexShrink: 0, marginTop: L.sp.xxs }} />

          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{
              margin: `0 0 ${L.sp.md} 0`,
              fontSize: FS.heading,
              fontWeight: 'bold',
              color: colors.text
            }}>
              {translateUI('cookieUsage', language)}
            </h3>
            <p style={{
              margin: `0 0 ${L.sp['2xl']} 0`,
              fontSize: FS.title,
              lineHeight: '1.5',
              color: colors.textSecondary
            }}>
              {translateUI('cookieBannerIntro', language)}
              <a
                href="/privacy"
                style={{
                  color: colors.primary,
                  textDecoration: 'none',
                  margin: `0 ${L.sp.xs}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {translateUI('privacyLink', language)}
              </a>
              {translateUI('cookieBannerIntroSuffix', language)}
            </p>

            <div style={{
              display: 'flex',
              gap: L.sp.xl,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <Button theme={theme} variant="primary" size="md" onClick={handleAcceptAll}>
                {translateUI('cookieAcceptAll', language)}
              </Button>

              <Button
                theme={theme}
                variant="outline"
                size="md"
                onClick={() => setShowSettings(!showSettings)}
                icon={<Settings size={16} />}
              >
                {translateUI('cookieManageSettings', language)}
              </Button>

              <Button theme={theme} variant="ghost" size="md" onClick={handleReject}>
                {translateUI('cookieEssentialOnly', language)}
              </Button>
            </div>
          </div>
        </div>

        {/* Cookie Settings Panel */}
        {showSettings && (
          <div style={{
            marginTop: L.sp['3xl'],
            padding: L.sp['3xl'],
            backgroundColor: colors.surfaceElevated,
            borderRadius: L.r.card,
            border: `1px solid ${colors.borderLight}`
          }}>
            <h4 style={{
              margin: `0 0 ${L.sp['2xl']} 0`,
              fontSize: FS.input,
              fontWeight: 'bold',
              color: colors.text
            }}>
              {translateUI('cookieSettingsTitle', language)}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: L.sp['2xl'] }}>
              {/* Necessary Cookies */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: L.sp['2xl']
              }}>
                <div style={{ flex: 1 }}>
                  <h5 style={{
                    margin: `0 0 ${L.sp.xs} 0`,
                    fontSize: FS.title,
                    fontWeight: '600',
                    color: colors.text
                  }}>
                    {translateUI('cookieNecessaryTitle', language)}
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: FS.caption,
                    color: colors.textSecondary,
                    lineHeight: '1.4'
                  }}>
                    {translateUI('cookieNecessaryDesc', language)}
                  </p>
                </div>
                {/* 常時ONで変更不可。分析/広告Cookieと同じSwitchアトムをdisabledで使う
                    （以前は専用の塗りつぶしdivを手書きしていた） */}
                <Switch
                  theme={theme}
                  checked={true}
                  disabled
                  onChange={() => {}}
                  label={translateUI('cookieNecessaryTitle', language)}
                />
              </div>

              {/* Analytics Cookies */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: L.sp['2xl']
              }}>
                <div style={{ flex: 1 }}>
                  <h5 style={{
                    margin: `0 0 ${L.sp.xs} 0`,
                    fontSize: FS.title,
                    fontWeight: '600',
                    color: colors.text
                  }}>
                    {translateUI('cookieAnalyticsTitle', language)}
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: FS.caption,
                    color: colors.textSecondary,
                    lineHeight: '1.4'
                  }}>
                    {translateUI('cookieAnalyticsDesc', language)}
                  </p>
                </div>
                <Switch
                  theme={theme}
                  checked={cookiePreferences.analytics}
                  onChange={(v) => setCookiePreferences(prev => ({ ...prev, analytics: v }))}
                  label={translateUI('cookieAnalyticsTitle', language)}
                />
              </div>

              {/* Advertising Cookies */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: L.sp['2xl']
              }}>
                <div style={{ flex: 1 }}>
                  <h5 style={{
                    margin: `0 0 ${L.sp.xs} 0`,
                    fontSize: FS.title,
                    fontWeight: '600',
                    color: colors.text
                  }}>
                    {translateUI('cookieAdvertisingTitle', language)}
                  </h5>
                  <p style={{
                    margin: 0,
                    fontSize: FS.caption,
                    color: colors.textSecondary,
                    lineHeight: '1.4'
                  }}>
                    {translateUI('cookieAdvertisingDesc', language)}
                  </p>
                </div>
                <Switch
                  theme={theme}
                  checked={cookiePreferences.advertising}
                  onChange={(v) => setCookiePreferences(prev => ({ ...prev, advertising: v }))}
                  label={translateUI('cookieAdvertisingTitle', language)}
                />
              </div>
            </div>

            <div style={{
              marginTop: L.sp['3xl'],
              display: 'flex',
              gap: L.sp.xl,
              justifyContent: 'flex-end'
            }}>
              <Button theme={theme} variant="outline" size="md" onClick={() => setShowSettings(false)}>
                {translateUI('cookieCancel', language)}
              </Button>
              <Button theme={theme} variant="primary" size="md" onClick={handleSaveSettings}>
                {translateUI('cookieSaveSettings', language)}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CookieBanner;