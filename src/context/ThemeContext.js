import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import * as DB from '../services/databaseService';

const ThemeContext = createContext(null);

// Custom Dark Theme - Monochrome High Contrast
const darkColors = {
  bg: '#000000',                    // --background: rgb(0 0 0)
  card: '#171717',                  // --card: rgb(23 23 23)
  cardLight: '#262626',             // --secondary: rgb(38 38 38) & --muted
  primary: '#E5E5E5',               // --primary: rgb(229 229 229)
  primaryMuted: 'rgba(229, 229, 229, 0.12)',
  primaryBorder: 'rgba(255, 255, 255, 0.1)', // --border
  secondary: '#262626',             // --secondary
  text: '#FAFAFA',                  // --foreground: rgb(250 250 250)
  textMuted: '#A1A1A1',             // --muted-foreground: rgb(161 161 161)
  textLight: '#888888',
  success: '#00BC7D',               // --chart-2
  warning: '#FE9A00',               // --chart-5
  error: '#FF6467',                 // --destructive
  input: 'rgba(255, 255, 255, 0.15)', // --input
  ring: '#737373',                  // --ring
};

// Modern Light Theme - Clean & Crisp
const lightColors = {
  bg: '#FFFFFF',                    // --background
  card: '#FFFFFF',                  // --card
  cardLight: '#F5F5F5',             // --secondary & --muted
  primary: '#171717',               // --primary: rgb(23 23 23)
  primaryMuted: 'rgba(23, 23, 23, 0.12)',
  primaryBorder: '#E5E5E5',         // --border
  secondary: '#F5F5F5',             // --secondary
  text: '#0A0A0A',                  // --foreground
  textMuted: '#737373',             // --muted-foreground
  textLight: '#999999',
  success: '#009689',               // --chart-2
  warning: '#FE9A00',               // --chart-5
  error: '#E7000B',                 // --destructive
  input: '#E5E5E5',                 // --input
  ring: '#A1A1A1',                  // --ring
};

// Warm Dark Theme - Cozy & Premium
const warmDarkColors = {
  bg: '#111111',                    // Background
  card: '#191919',                  // Card
  cardLight: '#222222',             // Muted
  primary: '#ffe0c2',               // Primary
  primaryMuted: 'rgba(255, 224, 194, 0.12)',
  primaryBorder: 'rgba(255, 224, 194, 0.25)',
  secondary: '#393028',             // Secondary
  text: '#eeeeee',                  // Foreground
  textMuted: '#b4b4b4',             // Muted Foreground
  textLight: '#888888',             // Lighter muted
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#e54d2e',                 // Destructive
  accent: '#2a2a2a',                // Accent
  accentForeground: '#eeeeee',      // Accent Foreground
  border: '#201e18',                // Border
  input: '#484848',                 // Input
  ring: '#ffe0c2',                  // Ring
  // Sidebar colors
  sidebarBg: '#18181b',
  sidebarForeground: '#f4f4f5',
  sidebarPrimary: '#1d4ed8',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#27272a',
  sidebarAccentForeground: '#f4f4f5',
  sidebarBorder: '#27272a',
  sidebarRing: '#d4d4d8',
};

// Theme definitions with metadata
export const THEMES = {
  dark: {
    id: 'dark',
    name: 'Modern Dark',
    description: 'High Contrast Monochrome',
    icon: '🌙',
    colors: darkColors,
  },
  light: {
    id: 'light',
    name: 'Modern Light',
    description: 'Clean & Minimalist',
    icon: '☀️',
    colors: lightColors,
  },
  warmDark: {
    id: 'warmDark',
    name: 'Warm Dark',
    description: 'Cozy & Premium',
    icon: '🔥',
    colors: warmDarkColors,
  },
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, [user]); // Reload when user changes

  const loadTheme = async () => {
    try {
      // 1. Try to load from Firebase if logged in
      if (user) {
        const settings = await DB.getUserSettings();
        if (settings?.theme && THEMES[settings.theme]) {
          setCurrentTheme(settings.theme);
          await AsyncStorage.setItem('theme', settings.theme); // Sync local
          setIsLoaded(true);
          return;
        }
      }

      // 2. Fallback to local storage
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null && THEMES[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setTheme = async (themeName) => {
    try {
      if (THEMES[themeName]) {
        setCurrentTheme(themeName);
        await AsyncStorage.setItem('theme', themeName);

        // Save to Firebase if logged in
        if (user) {
          await DB.saveUserSettings({ theme: themeName });
        }
      }
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  // Legacy support for toggleTheme
  const toggleTheme = async () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
  };

  const theme = THEMES[currentTheme];
  const colors = theme.colors;
  const isDark = currentTheme !== 'light';

  const value = {
    currentTheme,
    theme,
    isDark,
    toggleTheme,
    setTheme,
    colors,
    isLoaded,
    availableThemes: Object.values(THEMES),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
