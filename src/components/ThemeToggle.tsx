import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme, getThemeColors } from '../contexts/ThemeContext';
import { translateUI } from '../utils/translation'
import type { Language } from '../utils/translation';
import Button from './ui/atoms/Button';

interface ThemeToggleProps {
  language?: Language;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ language = 'japanese' }) => {
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <Button
      theme={theme}
      variant="outline"
      size="md"
      onClick={toggleTheme}
      title={translateUI(theme === 'light' ? 'switchToDarkMode' : 'switchToLightMode', language)}
      icon={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      styleOverride={{ minWidth: '120px' }}
    >
      {translateUI(theme === 'light' ? 'darkMode' : 'lightMode', language)}
    </Button>
  );
};

export default ThemeToggle;