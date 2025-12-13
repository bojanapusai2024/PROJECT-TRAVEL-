import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { TravelProvider } from '../context/TravelContext';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import MainApp from './MainApp';

export default function RootNavigator() {
  const { colors } = useTheme();
  const { user, initializing } = useAuth();
  const [authScreen, setAuthScreen] = useState('signIn');

  console.log('RootNavigator:', { user: user?.email, initializing });

  // Loading state
  if (initializing) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.bg }]}>
        <Text style={styles.logo}>✈️</Text>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { color: colors.textMuted }]}>Loading...</Text>
      </View>
    );
  }

  // Authenticated - show main app
  if (user && user.email) {
    console.log('RootNavigator: Showing MainApp');
    return (
      <TravelProvider>
        <MainApp />
      </TravelProvider>
    );
  }

  // Not authenticated - show auth screens
  console.log('RootNavigator: Showing auth screen:', authScreen);
  
  if (authScreen === 'signUp') {
    return <SignUpScreen onNavigateToSignIn={() => setAuthScreen('signIn')} />;
  }
  
  if (authScreen === 'forgotPassword') {
    return <ForgotPasswordScreen onNavigateToSignIn={() => setAuthScreen('signIn')} />;
  }
  
  return (
    <SignInScreen
      onNavigateToSignUp={() => setAuthScreen('signUp')}
      onNavigateToForgotPassword={() => setAuthScreen('forgotPassword')}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 64,
    marginBottom: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
});
