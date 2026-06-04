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
          <a
            href={`/about?lang=${language === 'japanese' ? 'ja' : 'en'}`}
            style={{
              color: colors.primary,
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {language === 'japanese' ? 'このサイトについて' : 'About'}
          </a>
          <a
            href={`/faq?lang=${language === 'japanese' ? 'ja' : 'en'}`}
            style={{
              color: colors.primary,
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {language === 'japanese' ? 'よくある質問' : 'FAQ'}
          </a>
          <a
            href={`/privacy?lang=${language === 'japanese' ? 'ja' : 'en'}`}
            style={{
              color: colors.primary,
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {language === 'japanese' ? 'プライバシーポリシー' : 'Privacy Policy'}
          </a>
          <a
            href={`/terms?lang=${language === 'japanese' ? 'ja' : 'en'}`}
            style={{
              color: colors.primary,
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {language === 'japanese' ? '利用規約' : 'Terms of Service'}
          </a>
          <a
            href={`/contact?lang=${language === 'japanese' ? 'ja' : 'en'}`}
            style={{
              color: colors.primary,
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            {language === 'japanese' ? 'お問い合わせ' : 'Contact'}
          </a>
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