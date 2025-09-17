import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import RailwayMap from './RailwayMap';

const ThemeWrapper: React.FC = () => {
  return (
    <ThemeProvider>
      <RailwayMap />
    </ThemeProvider>
  );
};

export default ThemeWrapper;