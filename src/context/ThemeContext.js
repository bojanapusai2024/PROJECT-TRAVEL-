import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import * as DB from '../services/databaseService';

const ThemeContext = createContext(null);

// --- KEPT THEMES ---

// Modern Dark Theme (Default)
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

// Royal Light (Previously Theme 1 Light) - Kept
const royalLightColors = {
  bg: '#F7F7F7',                    // oklch(0.967 0.001 0)
  card: '#FAFAFA',                  // oklch(0.976 0.001 0)
  cardLight: '#F5F5F5',
  primary: '#9333EA',               // oklch(0.653 0.186 274.621) -> Purple
  primaryMuted: 'rgba(147, 51, 234, 0.12)',
  primaryBorder: 'rgba(147, 51, 234, 0.25)',
  secondary: '#F5F5F5',
  text: '#111111',                  // oklch(0.067 0.001 0)
  textMuted: '#404040',
  textLight: '#737373',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  input: '#E5E5E5',
  ring: '#A1A1A1',
};

// Bold Light (Previously Theme 2 Light) - Kept
const boldLightColors = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  cardLight: '#F5F5F5',
  primary: '#202020',               // oklch(0.205 0 0) -> Black/Dark Gray
  primaryMuted: 'rgba(32, 32, 32, 0.12)',
  primaryBorder: '#E5E5E5',
  secondary: '#F5F5F5',
  text: '#202020',
  textMuted: '#737373',
  textLight: '#A1A1A1',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  input: '#E5E5E5',
  ring: '#A1A1A1',
};

// Gold Dark (Previously Theme 2 Dark) - Kept
const goldDarkColors = {
  bg: '#000000',
  card: '#000000',
  cardLight: '#171717',
  primary: '#FACC15',               // oklch(0.926 0.195 104.561) -> Yellow
  primaryMuted: 'rgba(250, 204, 21, 0.12)',
  primaryBorder: 'rgba(250, 204, 21, 0.25)',
  secondary: '#171717',
  text: '#D4D4D8',                  // oklch(0.832 0.015 43.985)
  textMuted: '#A1A1A1',
  textLight: '#737373',
  success: '#4ADE80',
  warning: '#FACC15',
  error: '#EF4444',
  input: '#000000',
  ring: '#FACC15',
};

// Violet Light Theme - Crisp White & Purple - Kept
const violetLightColors = {
  bg: '#FFFFFF',                    // --background
  card: '#FFFFFF',                  // --card
  cardLight: '#F3F4F6',             // --muted
  primary: '#2E1065',               // --primary: oklch(0.205 0 0) -> Dark Purple/Black
  primaryMuted: 'rgba(46, 16, 101, 0.08)',
  primaryBorder: '#E5E7EB',         // --border
  secondary: '#F3F4F6',             // --secondary
  text: '#020617',                  // --foreground
  textMuted: '#64748B',             // --muted-foreground
  textLight: '#94A3B8',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',                 // --destructive
  input: '#E5E7EB',                 // --input
  ring: '#7C3AED',                  // --ring
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

  // --- KEPT THEMES ---
  royalLight: {
    id: 'royalLight',
    name: 'Royal Light',
    description: 'Purple & Clean',
    icon: '👑',
    colors: royalLightColors,
  },
  boldLight: {
    id: 'boldLight',
    name: 'Bold Light',
    description: 'High Contrast Black',
    icon: '✒️',
    colors: boldLightColors,
  },
  goldDark: {
    id: 'goldDark',
    name: 'Gold Dark',
    description: 'Black & Yellow',
    icon: '⚡',
    colors: goldDarkColors,
  },
  violetLight: {
    id: 'violetLight',
    name: 'Violet Light',
    description: 'Crisp White & Purple',
    icon: '🔮',
    colors: violetLightColors,
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
