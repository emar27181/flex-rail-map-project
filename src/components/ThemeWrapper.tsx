import React, { useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import RailwayMap from './RailwayMap';
import Footer from './Footer';
import NavigationBar from './NavigationBar';

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
    </ThemeProvider>
  );
};

export default ThemeWrapper;