import React from 'react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateUI } from '../utils/translation';

interface FooterProps {
  language: 'japanese' | 'english';
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