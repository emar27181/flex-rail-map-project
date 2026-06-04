import React from 'react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <footer style={{
      marginTop: '40px',
      padding: '20px',
      backgroundColor: colors.surface,
      borderTop: `1px solid ${colors.border}`,
      fontSize: '14px',
      color: colors.textSecondary
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: colors.text }}>
          {translateUI('copyrightText', language)}
        </p>
        <p style={{ margin: '0 0 5px 0' }}>
          {translateUI('dataSourceText', language)}
        </p>
        <p style={{ margin: '0 0 5px 0' }}>
          {translateUI('disclaimerText', language)}
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          {translateUI('accuracyText', language)}
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          margin: '0 0 15px 0',
          fontSize: '12px',
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
                style={{ color: colors.primary, textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {translateUI(key, language)}
              </a>
            );
          })}
        </div>

        <p style={{ margin: '0 0 8px 0', fontSize: '12px' }}>
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
        </p>
        <p style={{ margin: '0', fontSize: '12px' }}>
          <a href="https://claude.ai/code" target="_blank" style={{ color: colors.primary, textDecoration: 'none' }}>
            {translateUI('madeWithText', language)}
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;