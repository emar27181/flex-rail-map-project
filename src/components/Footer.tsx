import React from 'react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';
import { TARGET, FS} from '../constants/ui';
import { L } from './legend/legendStyles';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <footer style={{
      marginTop: L.sp['5xl'],
      padding: L.sp['3xl'],
      backgroundColor: colors.surface,
      borderTop: `1px solid ${colors.border}`,
      fontSize: FS.sectionTitle,
      color: colors.textSecondary
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ margin: `0 0 ${L.sp.lg} 0`, fontWeight: 'bold', color: colors.text }}>
          {translateUI('copyrightText', language)}
        </p>
        <p style={{ margin: `0 0 ${L.sp.xs} 0` }}>
          {translateUI('dataSourceText', language)}
        </p>
        <p style={{ margin: `0 0 ${L.sp.xs} 0` }}>
          {translateUI('disclaimerText', language)}
        </p>
        <p style={{ margin: `0 0 ${L.sp.lg} 0` }}>
          {translateUI('accuracyText', language)}
        </p>

        <div style={{
          display: 'flex',
          gap: L.sp['3xl'],
          margin: `0 0 ${L.sp['2xl']} 0`,
          fontSize: FS.label,
          flexWrap: 'wrap'
        }}>
          {([
            ['about', 'aboutLink'],
            ['faq', 'faqLink'],
            ['privacy', 'privacyLink'],
            ['terms', 'termsLink'],
            ['contact', 'contactLink'],
          ] as [string, string][]).map(([page, key]) => {
            const lp = { japanese: 'ja', english: 'en', chinese: 'zh', korean: 'ko' }[language];
            return (
              <a
                key={page}
                href={`/${page}?lang=${lp}`}
                style={{
                  color: colors.primary,
                  textDecoration: 'none',
                  // WCAG 2.2 AA (2.5.8 ターゲットサイズ) の最小24pxを満たす
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: '24px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {translateUI(key, language)}
              </a>
            );
          })}
        </div>

        <p style={{ margin: `0 0 ${L.sp.md} 0`, fontSize: FS.label }}>
          Developed by{' '}
          <a
            href="https://github.com/emar27181"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: colors.primary,
              textDecoration: 'none',
              // WCAG 2.2 AA (2.5.8 ターゲットサイズ) の最小24pxを満たす
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: `${TARGET.min}px`
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            ema | GitHub: emar27181
          </a>
        </p>
        <p style={{ margin: `0`, fontSize: FS.label }}>
          <a href="https://claude.ai/code" target="_blank" style={{ color: colors.primary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: `${TARGET.min}px` }}>
            {translateUI('madeWithText', language)}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;