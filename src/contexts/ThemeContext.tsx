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
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // ローカルストレージから設定を読み込み
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
    // 保存済み設定がなければデフォルトのダークのまま
  }, []);

  useEffect(() => {
    // テーマ変更時にローカルストレージに保存
    localStorage.setItem('theme', theme);

    // body要素にクラスを追加してグローバルスタイルを適用（他クラスは保持）
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
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
    surfaceHover: theme === 'dark' ? '#404040' : '#f0f0f0',
    border: theme === 'dark' ? '#404040' : '#ddd',
    borderLight: theme === 'dark' ? '#505050' : '#eee',
    text: theme === 'dark' ? '#ffffff' : '#333',
    textSecondary: theme === 'dark' ? '#b3b3b3' : '#666',
    textMuted: theme === 'dark' ? '#888888' : '#888',
    primary: theme === 'dark' ? '#4a9eff' : '#2196F3',
    primaryHover: theme === 'dark' ? '#3d8ce6' : '#1976D2',
    onPrimary: '#ffffff',
    onSurface: theme === 'dark' ? '#ffffff' : '#333',
    success: theme === 'dark' ? '#5cb85c' : '#4CAF50',
    successLight: theme === 'dark' ? '#2d4a2d' : '#e8f5e9',
    warning: theme === 'dark' ? '#f0ad4e' : '#ff9800',
    warningLight: theme === 'dark' ? '#4a3d2d' : '#fff3e0',
    info: theme === 'dark' ? '#5bc0de' : '#2196F3',
    infoLight: theme === 'dark' ? '#2d3d4a' : '#e3f2fd',
    shadow: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)',
    shadowHeavy: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
    // 半透明バリアント（折りたたみUIや常時表示ウィジェット向け）
    glassCollapsed: theme === 'dark' ? 'rgba(45,45,45,0.72)' : 'rgba(249,249,249,0.72)',
    glassOpen:      theme === 'dark' ? 'rgba(45,45,45,0.96)' : 'rgba(249,249,249,0.96)',
    glassButton:    theme === 'dark' ? 'rgba(58,58,58,0.82)' : 'rgba(255,255,255,0.82)',
  };
};

// 路線色のダークモード調整
export const adjustRouteColorForTheme = (originalColor: string, theme: Theme): string => {
  if (theme === 'light') return originalColor;

  // ダークモードでの色調整（コントラスト比を考慮した明度調整）
  const colorAdjustments: { [key: string]: string } = {
    '#E60012': '#ff4444', // JR山手線: より明るい赤
    '#0067C0': '#4488ff', // JR京浜東北線: より明るい青
    '#FF9500': '#ffaa33', // JR中央線: より明るいオレンジ
    '#006837': '#44aa44', // JR常磐線: より明るい緑
    '#A7A9AC': '#cccccc', // 総武線: より明るいグレー
    '#FF6319': '#ff8844', // 東西線: より明るいオレンジ
    '#00B48D': '#44ddaa', // 千代田線: より明るい緑
    '#9C5F19': '#cc8844', // 銀座線: より明るい茶色
    '#C1272D': '#ee4444', // 丸ノ内線: より明るい赤
    '#A682CC': '#bb99dd', // 半蔵門線: より明るい紫
    '#8F76D6': '#aa88ee', // 副都心線: より明るい紫
    '#9CAEB7': '#bbccdd', // 日比谷線: より明るいグレー
    '#00A251': '#44cc66', // 有楽町線: より明るい緑
    '#00ADA9': '#44ddcc', // 南北線: より明るいティール
    '#E85298': '#ff77bb', // 都営新宿線: より明るいピンク
    '#6CBB5A': '#88dd77', // 都営大江戸線: より明るい緑
    '#B6007A': '#dd4499', // 都営浅草線: より明るいマゼンタ
    '#0079C2': '#4499ee', // 都営三田線: より明るい青
  };

  // 指定された色の調整があればそれを使用、なければ明度を上げる
  if (colorAdjustments[originalColor]) {
    return colorAdjustments[originalColor];
  }

  // 16進数カラーコードの明度を上げる汎用処理
  if (originalColor.startsWith('#') && originalColor.length === 7) {
    const r = parseInt(originalColor.slice(1, 3), 16);
    const g = parseInt(originalColor.slice(3, 5), 16);
    const b = parseInt(originalColor.slice(5, 7), 16);

    // 各成分に40を加算（上限255）
    const adjustedR = Math.min(255, r + 40);
    const adjustedG = Math.min(255, g + 40);
    const adjustedB = Math.min(255, b + 40);

    return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
  }

  return originalColor;
};