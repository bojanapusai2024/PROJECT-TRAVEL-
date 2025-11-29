import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from '../screens/WelcomeScreen';
import TripSetupScreen from '../screens/TripSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import BudgetScreen from '../screens/BudgetScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import PackingScreen from '../screens/PackingScreen';
import MapScreen from '../screens/MapScreen';
import { useTravelContext } from '../context/TravelContext';

const Tab = createBottomTabNavigator();

const COLORS = {
  bg: '#000000',
  green: '#00FF7F',
  greenMuted: 'rgba(0, 255, 127, 0.15)',
  textMuted: '#666666',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused }) => {
          let emoji = '🏠';
          if (route.name === 'Budget') emoji = '💰';
          if (route.name === 'Expenses') emoji = '💳';
          if (route.name === 'Packing') emoji = '🎒';
          if (route.name === 'Map') emoji = '🗺️';
          return (
            <View style={[styles.iconWrap, focused && styles.iconActive]}>
              <Text style={styles.icon}>{emoji}</Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Expenses" component={ExpenseScreen} />
      <Tab.Screen name="Packing" component={PackingScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [screen, setScreen] = useState('welcome'); // 'welcome', 'setup', 'main'
  const { setTripInfo, setBudget } = useTravelContext();

  const handlePlanTrip = () => {
    setScreen('setup');
  };

  const handleJoinTrip = (code) => {
    // In real app, fetch trip data from server using code
    console.log('Joining trip with code:', code);
    setScreen('main');
  };

  const handleSetupComplete = (tripData) => {
    // Save trip data to context
    setTripInfo({
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      name: tripData.name,
      participants: tripData.participants,
    });
    setBudget(prev => ({
      ...prev,
      total: parseFloat(tripData.budget) || 0,
    }));
    setScreen('main');
  };

  const handleBackToWelcome = () => {
    setScreen('welcome');
  };

  if (screen === 'welcome') {
    return (
      <WelcomeScreen 
        onPlanTrip={handlePlanTrip}
        onJoinTrip={handleJoinTrip}
      />
    );
  }

  if (screen === 'setup') {
    return (
      <TripSetupScreen 
        onComplete={handleSetupComplete}
        onBack={handleBackToWelcome}
      />
    );
  }

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000',
    borderTopColor: '#1a1a1a',
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  iconWrap: {
    padding: 8,
    borderRadius: 12,
  },
  iconActive: {
    backgroundColor: COLORS.greenMuted,
  },
  icon: {
    fontSize: 22,
  },
});
