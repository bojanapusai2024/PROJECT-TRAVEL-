import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext(null);

// Custom Deep Blue Dark Theme
const darkColors = {
  bg: '#070F2B',                    // Deepest blue-black
  card: '#1B1A55',                  // Dark purple-blue
  cardLight: '#535C91',             // Medium purple-blue
  primary: '#9290C3',               // Light lavender
  primaryMuted: 'rgba(146, 144, 195, 0.15)',
  primaryBorder: 'rgba(146, 144, 195, 0.3)',
  secondary: '#FF6B9D',             // Soft pink accent
  text: '#FAFAFA',                  // Pure white
  textMuted: '#9290C3',             // Lavender gray
  textLight: '#535C91',             // Muted purple
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
};

// Sunrise Light Theme - Warm & Inviting
const lightColors = {
  bg: '#FFF8F0',                    // Warm cream white
  card: '#FFFFFF',                  // Pure white cards
  cardLight: '#FFF1E6',             // Soft peach tint
  primary: '#FF6B35',               // Sunrise orange
  primaryMuted: 'rgba(255, 107, 53, 0.12)',
  primaryBorder: 'rgba(255, 107, 53, 0.25)',
  secondary: '#004E89',             // Deep ocean blue
  text: '#1A1A2E',                  // Dark navy text
  textMuted: '#6B7280',             // Warm gray
  textLight: '#9CA3AF',             // Light warm gray
  success: '#10B981',
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
