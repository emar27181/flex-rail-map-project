import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // ローカルストレージから設定を読み込み
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // システムの設定を確認
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // テーマ変更時にローカルストレージに保存
    localStorage.setItem('theme', theme);

    // body要素にクラスを追加してグローバルスタイルを適用
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// テーマに応じた色の定義
export const getThemeColors = (theme: Theme) => {
  return {
    background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    surface: theme === 'dark' ? '#2d2d2d' : '#f9f9f9',
    surfaceElevated: theme === 'dark' ? '#3a3a3a' : '#ffffff',
    border: theme === 'dark' ? '#404040' : '#ddd',
    borderLight: theme === 'dark' ? '#505050' : '#eee',
    text: theme === 'dark' ? '#ffffff' : '#333',
    textSecondary: theme === 'dark' ? '#b3b3b3' : '#666',
    textMuted: theme === 'dark' ? '#888888' : '#888',
    primary: theme === 'dark' ? '#4a9eff' : '#2196F3',
    primaryHover: theme === 'dark' ? '#3d8ce6' : '#1976D2',
    success: theme === 'dark' ? '#5cb85c' : '#4CAF50',
    warning: theme === 'dark' ? '#f0ad4e' : '#ff9800',
    shadow: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)',
    shadowHeavy: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
  };
};