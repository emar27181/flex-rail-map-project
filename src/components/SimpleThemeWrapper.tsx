import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';

interface SimpleThemeWrapperProps {
  children?: React.ReactNode;
}

const SimpleThemeWrapper: React.FC<SimpleThemeWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default SimpleThemeWrapper;