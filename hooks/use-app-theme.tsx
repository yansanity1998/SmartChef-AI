import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemeContextType = {
  colorScheme: ColorSchemeName;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorSchemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setInternalColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  const toggleColorScheme = () => {
    setInternalColorScheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setColorScheme = (scheme: ColorSchemeName) => {
    setInternalColorScheme(scheme);
  };

  // Optional: Sync with system theme but we'll prioritize the manual override
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only sync if they haven't manually set it? 
      // For now, let's allow system override unless we add persisting logic
      setInternalColorScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
