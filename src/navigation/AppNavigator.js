import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import BudgetScreen from '../screens/BudgetScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import PackingScreen from '../screens/PackingScreen';
import MapScreen from '../screens/MapScreen';

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
  const [hasTrip, setHasTrip] = useState(false);
  const [tripMode, setTripMode] = useState(null); // 'plan' or 'join'

  const handlePlanTrip = () => {
    setTripMode('plan');
    setHasTrip(true);
  };

  const handleJoinTrip = (code) => {
    setTripMode('join');
    setHasTrip(true);
    // In real app, validate code and fetch trip data
    console.log('Joining trip with code:', code);
  };

  if (!hasTrip) {
    return (
      <WelcomeScreen 
        onPlanTrip={handlePlanTrip}
        onJoinTrip={handleJoinTrip}
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
