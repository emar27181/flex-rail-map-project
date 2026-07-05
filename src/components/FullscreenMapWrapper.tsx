import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import RailwayMap from './RailwayMap';
import type { Language } from '../utils/translation';
import { getInitialLanguage, persistLanguage } from '../utils/languagePersistence';

const FullscreenMapWrapper: React.FC = () => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    persistLanguage(language);
  }, [language]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <ThemeProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <RailwayMap language={language} onLanguageChange={handleLanguageChange} />
      </div>
    </ThemeProvider>
  );
};

export default FullscreenMapWrapper;
