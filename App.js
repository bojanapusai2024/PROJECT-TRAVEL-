import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';
import PackingScreen from './src/screens/PackingScreen';
import MapScreen from './src/screens/MapScreen';
import { TravelProvider } from './src/context/TravelContext';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => (
  <View className={`items-center justify-center p-2 ${focused ? 'bg-accent-green/20 rounded-xl' : ''}`}>
    <Text className={`text-xl ${focused ? 'text-accent-green' : 'text-gray-400'}`}>
      {name === 'Home' && '🏠'}
      {name === 'Budget' && '💰'}
      {name === 'Expenses' && '💳'}
      {name === 'Packing' && '🎒'}
      {name === 'Map' && '🗺️'}
    </Text>
    <Text className={`text-xs mt-1 ${focused ? 'text-accent-green font-semibold' : 'text-gray-400'}`}>
      {name}
    </Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <TravelProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#0D0D0D',
                borderTopColor: '#1F1F3D',
                borderTopWidth: 1,
                height: 80,
                paddingBottom: 10,
                paddingTop: 10,
              },
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Budget" component={BudgetScreen} />
            <Tab.Screen name="Expenses" component={ExpenseScreen} />
            <Tab.Screen name="Packing" component={PackingScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </TravelProvider>
    </SafeAreaProvider>
  );
}
