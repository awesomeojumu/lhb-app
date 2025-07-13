// src/context/UIContext.jsx
import React, { createContext, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from '../theme';

export const UIContext = createContext();

const UIProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const theme = getTheme(mode);

  return (
    <UIContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </UIContext.Provider>
  );
};

export default UIProvider;
