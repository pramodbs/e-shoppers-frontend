import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeCtx = createContext();

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    
    // Toggle body class
    if (mode === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    // Toggle PrimeReact theme
    const themeLink = document.getElementById('theme-link');
    if (themeLink) {
      const themePath = mode === 'dark' 
        ? '/node_modules/primereact/resources/themes/lara-dark-indigo/theme.css' 
        : '/node_modules/primereact/resources/themes/lara-light-indigo/theme.css';
      themeLink.setAttribute('href', themePath);
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeCtx.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeCtx);
