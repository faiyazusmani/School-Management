import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.add('dark');
    root.classList.remove('light');
    body?.classList.add('dark');
    body?.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('edumanage_theme', 'dark');
  }, []);

  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
