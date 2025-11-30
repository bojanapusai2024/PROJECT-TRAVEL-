import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext(null);

// Premium Midnight Dark Theme
const darkColors = {
  bg: '#0D0D0F',              // Deep black with slight blue
  card: '#16161A',            // Elevated surface
  cardLight: '#1E1E24',       // Lighter card
  primary: '#00E676',         // Vibrant green
  primaryMuted: 'rgba(0, 230, 118, 0.12)',
  primaryBorder: 'rgba(0, 230, 118, 0.25)',
  secondary: '#FF6B6B',       // Coral accent
  text: '#FAFAFA',            // Pure white text
  textMuted: '#71717A',       // Zinc gray
  textLight: '#52525B',       // Darker muted
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

// Clean Light Theme
const lightColors = {
  bg: '#F8FAFC',              // Soft white
  card: '#FFFFFF',            // Pure white cards
  cardLight: '#F1F5F9',       // Slight gray
  primary: '#059669',         // Emerald green
  primaryMuted: 'rgba(5, 150, 105, 0.1)',
  primaryBorder: 'rgba(5, 150, 105, 0.2)',
  secondary: '#F43F5E',       // Rose accent
  text: '#0F172A',            // Dark slate
  textMuted: '#64748B',       // Slate gray
  textLight: '#94A3B8',       // Light slate
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  const value = {
    isDark,
    toggleTheme,
    colors,
    isLoaded,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
