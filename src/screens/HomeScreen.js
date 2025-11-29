import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTravelContext } from '../context/TravelContext';

export default function HomeScreen() {
  const { tripInfo, setTripInfo, budget, getTotalExpenses, getRemainingBudget, packingItems } = useTravelContext();
  const [isEditing, setIsEditing] = useState(false);

  const packedCount = packingItems.filter(item => item.packed).length;
  const totalItems = packingItems.length;

  const QuickStatCard = ({ emoji, title, value, subtitle, color }) => (
    <View className={`bg-surface-card rounded-2xl p-4 flex-1 mx-1 border border-${color}/30`}>
      <Text className="text-2xl mb-2">{emoji}</Text>
      <Text className="text-gray-400 text-xs">{title}</Text>
      <Text className={`text-${color} text-xl font-bold`}>{value}</Text>
      {subtitle && <Text className="text-gray-500 text-xs mt-1">{subtitle}</Text>}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary-black">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="mt-4 mb-6">
          <Text className="text-gray-400 text-sm">Welcome back</Text>
          <Text className="text-white text-3xl font-bold">Travel Companion ✈️</Text>
        </View>

        {/* Trip Info Card */}
        <View className="bg-surface-card rounded-3xl p-5 mb-6 border border-secondary-purple/20">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-semibold">Trip Details</Text>
            <TouchableOpacity 
              onPress={() => setIsEditing(!isEditing)}
              className="bg-accent-green/20 px-4 py-2 rounded-full"
            >
              <Text className="text-accent-green text-sm">{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View>
              <TextInput
                className="bg-primary-dark text-white p-4 rounded-xl mb-3 border border-secondary-purple/30"
                placeholder="Destination"
                placeholderTextColor="#666"
                value={tripInfo.destination}
                onChangeText={(text) => setTripInfo({...tripInfo, destination: text})}
              />
              <View className="flex-row">
                <TextInput
                  className="bg-primary-dark text-white p-4 rounded-xl flex-1 mr-2 border border-accent-green/30"
                  placeholder="Start Date"
                  placeholderTextColor="#666"
                  value={tripInfo.startDate}
                  onChangeText={(text) => setTripInfo({...tripInfo, startDate: text})}
                />
                <TextInput
                  className="bg-primary-dark text-white p-4 rounded-xl flex-1 ml-2 border border-accent-green/30"
                  placeholder="End Date"
                  placeholderTextColor="#666"
                  value={tripInfo.endDate}
                  onChangeText={(text) => setTripInfo({...tripInfo, endDate: text})}
                />
              </View>
            </View>
          ) : (
            <View>
              <View className="flex-row items-center mb-3">
                <Text className="text-3xl mr-3">📍</Text>
                <Text className="text-white text-2xl font-bold">
                  {tripInfo.destination || 'Set your destination'}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-xl mr-2">📅</Text>
                <Text className="text-gray-400">
                  {tripInfo.startDate && tripInfo.endDate 
                    ? `${tripInfo.startDate} - ${tripInfo.endDate}`
                    : 'Set your travel dates'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <Text className="text-white text-lg font-semibold mb-3">Quick Overview</Text>
        <View className="flex-row mb-4">
          <QuickStatCard 
            emoji="💰"
            title="Budget"
            value={`$${budget.total}`}
            color="accent-green"
          />
          <QuickStatCard 
            emoji="💸"
            title="Spent"
            value={`$${getTotalExpenses()}`}
            color="secondary-purple"
          />
        </View>
        <View className="flex-row mb-6">
          <QuickStatCard 
            emoji="📊"
            title="Remaining"
            value={`$${getRemainingBudget()}`}
            subtitle={budget.total > 0 ? `${((getRemainingBudget() / budget.total) * 100).toFixed(0)}% left` : ''}
            color="accent-green"
          />
          <QuickStatCard 
            emoji="🎒"
            title="Packed"
            value={`${packedCount}/${totalItems}`}
            subtitle={totalItems > 0 ? `${((packedCount / totalItems) * 100).toFixed(0)}% done` : 'No items'}
            color="secondary-purple"
          />
        </View>

        {/* Quick Actions */}
        <Text className="text-white text-lg font-semibold mb-3">Quick Actions</Text>
        <View className="flex-row flex-wrap mb-6">
          {[
            { emoji: '➕', label: 'Add Expense', color: 'accent-green' },
            { emoji: '📝', label: 'Add Item', color: 'secondary-purple' },
            { emoji: '📍', label: 'Add Stop', color: 'accent-green' },
            { emoji: '📊', label: 'View Stats', color: 'secondary-purple' },
          ].map((action, index) => (
            <TouchableOpacity 
              key={index}
              className={`bg-surface-card border border-${action.color}/30 rounded-2xl p-4 w-[48%] mb-3 ${index % 2 === 0 ? 'mr-[2%]' : 'ml-[2%]'}`}
            >
              <Text className="text-2xl mb-2">{action.emoji}</Text>
              <Text className="text-white font-medium">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips Section */}
        <View className="bg-gradient-to-r from-accent-green/10 to-secondary-purple/10 rounded-3xl p-5 mb-8 border border-accent-green/20">
          <Text className="text-accent-green text-lg font-semibold mb-2">💡 Travel Tip</Text>
          <Text className="text-gray-300">
            Pack light! Remember the 5-4-3-2-1 rule: 5 tops, 4 bottoms, 3 pairs of shoes, 2 bags, 1 hat.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
