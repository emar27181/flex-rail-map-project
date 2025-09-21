import React, { useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import RailwayMap from './RailwayMap';
import Footer from './Footer';
import NavigationBar from './NavigationBar';
import AdSenseAd from './AdSenseAd';
import StickyBottomAd from './StickyBottomAd';

const ThemeWrapper: React.FC = () => {
  const [language, setLanguage] = useState<'japanese' | 'english'>('japanese');

  const handleLanguageChange = (newLanguage: 'japanese' | 'english') => {
    setLanguage(newLanguage);
  };

  return (
    <ThemeProvider>
      <NavigationBar language={language} onLanguageChange={handleLanguageChange} />
      <RailwayMap language={language} />
      <Footer language={language} />

      {/* 追従型広告（画面下固定） */}
      <StickyBottomAd adSlot="0987654321" />
    </ThemeProvider>
  );
};

export default ThemeWrapper;