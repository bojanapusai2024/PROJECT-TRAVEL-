import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from '../screens/WelcomeScreen';
import TripSetupScreen from '../screens/TripSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import BudgetScreen from '../screens/BudgetScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import PackingScreen from '../screens/PackingScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FloatingFooter from '../components/FloatingFooter';
import { useTravelContext } from '../context/TravelContext';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

function TripTabs({ onBackToHome }) {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.bg,
            borderTopColor: colors.primaryBorder,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ focused }) => {
            let emoji = '🏠';
            if (route.name === 'Budget') emoji = '💰';
            if (route.name === 'Expenses') emoji = '💳';
            if (route.name === 'Packing') emoji = '🎒';
            if (route.name === 'Itinerary') emoji = '🗺️';
            return (
              <View style={[
                { padding: 8, borderRadius: 12 },
                focused && { backgroundColor: colors.primaryMuted }
              ]}>
                <Text style={{ fontSize: 22 }}>{emoji}</Text>
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Dashboard">
          {() => <HomeScreen onBackToHome={onBackToHome} />}
        </Tab.Screen>
        <Tab.Screen name="Budget" component={BudgetScreen} />
        <Tab.Screen name="Expenses" component={ExpenseScreen} />
        <Tab.Screen name="Packing" component={PackingScreen} />
        <Tab.Screen name="Itinerary" component={MapScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  const [screen, setScreen] = useState('welcome');
  const [activeTab, setActiveTab] = useState('home');
  const { setTripInfo, setBudget } = useTravelContext();
  const { colors } = useTheme();

  const handlePlanTrip = () => setScreen('setup');

  const handleJoinTrip = (code) => {
    console.log('Joining trip with code:', code);
    setScreen('trip');
    setActiveTab('trip');
  };

  const handleSetupComplete = (tripData) => {
    setTripInfo({
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      name: tripData.name,
      participants: tripData.participants,
    });
    setBudget(prev => ({ ...prev, total: parseFloat(tripData.budget) || 0 }));
    setScreen('trip');
    setActiveTab('trip');
  };

  const handleBackToWelcome = () => {
    setScreen('welcome');
    setActiveTab('home');
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') setScreen('welcome');
    else if (tab === 'trip') setScreen('trip');
    else if (tab === 'profile') setScreen('profile');
  };

  // Setup screen - no footer
  if (screen === 'setup') {
    return (
      <TripSetupScreen 
        onComplete={handleSetupComplete}
        onBack={handleBackToWelcome}
      />
    );
  }

  // Trip tabs - uses bottom tab navigator (no main footer)
  if (screen === 'trip') {
    return <TripTabs onBackToHome={handleBackToWelcome} />;
  }

  // Screens with main footer
  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onPlanTrip={handlePlanTrip}
            onJoinTrip={handleJoinTrip}
          />
        );
      case 'profile':
        return <ProfileScreen />;
      default:
        return (
          <WelcomeScreen 
            onPlanTrip={handlePlanTrip}
            onJoinTrip={handleJoinTrip}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>
      <FloatingFooter activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const createTabStyles = (colors) => StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bg,
    borderTopColor: colors.primaryBorder,
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
    backgroundColor: colors.primaryMuted,
  },
  icon: {
    fontSize: 22,
  },
});
