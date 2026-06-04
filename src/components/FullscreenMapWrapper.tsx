import React, { useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import RailwayMap from './RailwayMap';
import type { Language } from '../utils/translation';

const FullscreenMapWrapper: React.FC = () => {
  const [language] = useState<Language>('japanese');

  return (
    <ThemeProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <RailwayMap language={language} />
      </div>
    </ThemeProvider>
  );
};

export default FullscreenMapWrapper;
