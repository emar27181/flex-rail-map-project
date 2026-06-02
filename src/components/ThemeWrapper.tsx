import React, { useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import RailwayMap from './RailwayMap';
import Footer from './Footer';
import NavigationBar from './NavigationBar';
import AdSenseAd from './AdSenseAd';
import StickyBottomAd from './StickyBottomAd';

const ThemeWrapper: React.FC = () => {
  const [language, setLanguage] = useState<'japanese' | 'english'>('japanese');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLanguageChange = (newLanguage: 'japanese' | 'english') => {
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