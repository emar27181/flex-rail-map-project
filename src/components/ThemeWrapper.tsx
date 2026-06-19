import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import RailwayMap from './RailwayMap';
import Footer from './Footer';
import NavigationBar from './NavigationBar';
import AdSenseAd from './AdSenseAd';
import StickyBottomAd from './StickyBottomAd';
import type { Language } from '../utils/translation';
import { getInitialLanguage, persistLanguage } from '../utils/languagePersistence';

const ThemeWrapper: React.FC = () => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    persistLanguage(language);
  }, [language]);

  // JS読み込み完了後にローディング画面を非表示にする
  useEffect(() => {
    const el = document.getElementById('app-loading');
    if (el) el.style.display = 'none';
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <ThemeProvider>
      {/* 追従型広告: RailwayMap より先に置くことで同z-index競合時に地図が前面に来る */}
      {!isFullscreen && <StickyBottomAd adSlot="0987654321" />}
      <NavigationBar language={language} onLanguageChange={handleLanguageChange} isFullscreen={isFullscreen} />
      <RailwayMap language={language} onLanguageChange={handleLanguageChange} onFullscreenChange={setIsFullscreen} />
      <Footer language={language} />
    </ThemeProvider>
  );
};

export default ThemeWrapper;
