import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTravelContext } from '../context/TravelContext';

const CATEGORIES = [
  { key: 'accommodation', label: 'Accommodation', emoji: '🏨' },
  { key: 'transport', label: 'Transport', emoji: '🚗' },
  { key: 'food', label: 'Food & Drinks', emoji: '🍽️' },
  { key: 'activities', label: 'Activities', emoji: '🎭' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { key: 'other', label: 'Other', emoji: '📦' },
];

export default function BudgetScreen() {
  const { budget, setBudget, getExpensesByCategory } = useTravelContext();
  const [totalBudget, setTotalBudget] = useState(budget.total.toString());
  const expensesByCategory = getExpensesByCategory();

  const handleSaveBudget = () => {
    setBudget({
      ...budget,
      total: parseFloat(totalBudget) || 0
    });
  };

  const updateCategoryBudget = (category, value) => {
    setBudget({
      ...budget,
      categories: {
        ...budget.categories,
        [category]: parseFloat(value) || 0
      }
    });
  };

  const allocatedTotal = Object.values(budget.categories).reduce((sum, val) => sum + val, 0);
  const unallocated = budget.total - allocatedTotal;

  const ProgressBar = ({ spent, allocated, color }) => {
    const percentage = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
    return (
      <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <View 
          className={`h-full ${percentage > 90 ? 'bg-red-500' : `bg-${color}`} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-black">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="mt-4 mb-6">
          <Text className="text-white text-3xl font-bold">Budget Planner 💰</Text>
          <Text className="text-gray-400 mt-1">Plan your travel budget wisely</Text>
        </View>

        {/* Total Budget Card */}
        <View className="bg-surface-card rounded-3xl p-5 mb-6 border border-accent-green/30">
          <Text className="text-gray-400 text-sm mb-2">Total Trip Budget</Text>
          <View className="flex-row items-center">
            <Text className="text-white text-2xl mr-2">$</Text>
            <TextInput
              className="flex-1 bg-primary-dark text-white text-3xl font-bold p-4 rounded-xl"
              keyboardType="numeric"
              value={totalBudget}
              onChangeText={setTotalBudget}
              onBlur={handleSaveBudget}
              placeholderTextColor="#666"
              placeholder="0"
            />
          </View>
        </View>

        {/* Budget Summary */}
        <View className="flex-row mb-6">
          <View className="flex-1 bg-accent-green/10 rounded-2xl p-4 mr-2 border border-accent-green/30">
            <Text className="text-gray-400 text-xs">Allocated</Text>
            <Text className="text-accent-green text-xl font-bold">${allocatedTotal}</Text>
          </View>
          <View className="flex-1 bg-secondary-purple/10 rounded-2xl p-4 ml-2 border border-secondary-purple/30">
            <Text className="text-gray-400 text-xs">Unallocated</Text>
            <Text className={`text-xl font-bold ${unallocated >= 0 ? 'text-secondary-purple' : 'text-red-500'}`}>
              ${unallocated}
            </Text>
          </View>
        </View>

        {/* Category Budgets */}
        <Text className="text-white text-lg font-semibold mb-3">Budget by Category</Text>
        {CATEGORIES.map((category, index) => {
          const spent = expensesByCategory[category.key] || 0;
          const allocated = budget.categories[category.key] || 0;
          
          return (
            <View 
              key={category.key}
              className="bg-surface-card rounded-2xl p-4 mb-3 border border-gray-700"
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{category.emoji}</Text>
                  <View className="flex-1">
                    <Text className="text-white font-medium">{category.label}</Text>
                    <Text className="text-gray-400 text-xs">
                      Spent: ${spent} / ${allocated}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center bg-primary-dark rounded-xl px-3">
                  <Text className="text-gray-400 mr-1">$</Text>
                  <TextInput
                    className="text-white text-lg py-2 w-20 text-right"
                    keyboardType="numeric"
                    value={allocated.toString()}
                    onChangeText={(text) => updateCategoryBudget(category.key, text)}
                    placeholderTextColor="#666"
                    placeholder="0"
                  />
                </View>
              </View>
              <ProgressBar 
                spent={spent} 
                allocated={allocated}
                color={index % 2 === 0 ? 'accent-green' : 'secondary-purple'}
              />
            </View>
          );
        })}

        {/* Tips */}
        <View className="bg-secondary-purple/10 rounded-3xl p-5 mt-4 mb-8 border border-secondary-purple/20">
          <Text className="text-secondary-purple text-lg font-semibold mb-2">💡 Budget Tips</Text>
          <Text className="text-gray-300 mb-2">• Set aside 10-15% for unexpected expenses</Text>
          <Text className="text-gray-300 mb-2">• Food usually costs more than expected abroad</Text>
          <Text className="text-gray-300">• Book activities in advance for better deals</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
