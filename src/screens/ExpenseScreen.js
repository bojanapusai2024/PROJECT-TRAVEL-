import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
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

export default function ExpenseScreen() {
  const { expenses, addExpense, deleteExpense, getTotalExpenses, budget, getRemainingBudget } = useTravelContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'food',
    date: new Date().toLocaleDateString(),
    notes: ''
  });

  const handleAddExpense = () => {
    if (newExpense.title && newExpense.amount) {
      addExpense({
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      setNewExpense({
        title: '',
        amount: '',
        category: 'food',
        date: new Date().toLocaleDateString(),
        notes: ''
      });
      setModalVisible(false);
    }
  };

  const getCategoryInfo = (key) => CATEGORIES.find(c => c.key === key) || CATEGORIES[5];

  const ExpenseItem = ({ item }) => {
    const category = getCategoryInfo(item.category);
    return (
      <View className="bg-surface-card rounded-2xl p-4 mb-3 border border-gray-700">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="bg-primary-dark rounded-xl p-3 mr-3">
              <Text className="text-2xl">{category.emoji}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium text-base">{item.title}</Text>
              <Text className="text-gray-400 text-xs">{category.label} • {item.date}</Text>
              {item.notes && <Text className="text-gray-500 text-xs mt-1">{item.notes}</Text>}
            </View>
          </View>
          <View className="items-end">
            <Text className="text-secondary-purple text-lg font-bold">-${item.amount}</Text>
            <TouchableOpacity onPress={() => deleteExpense(item.id)}>
              <Text className="text-red-400 text-xs mt-1">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const remainingBudget = getRemainingBudget();
  const spentPercentage = budget.total > 0 ? (getTotalExpenses() / budget.total) * 100 : 0;

  return (
    <SafeAreaView className="flex-1 bg-primary-black">
      {/* Header */}
      <View className="px-4 mt-4 mb-4">
        <Text className="text-white text-3xl font-bold">Expenses 💳</Text>
        <Text className="text-gray-400 mt-1">Track every penny you spend</Text>
      </View>

      {/* Summary Card */}
      <View className="mx-4 bg-surface-card rounded-3xl p-5 mb-4 border border-secondary-purple/30">
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-gray-400 text-xs">Total Spent</Text>
            <Text className="text-secondary-purple text-3xl font-bold">${getTotalExpenses()}</Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-400 text-xs">Remaining</Text>
            <Text className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-accent-green' : 'text-red-500'}`}>
              ${remainingBudget}
            </Text>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <View 
            className={`h-full rounded-full ${spentPercentage > 90 ? 'bg-red-500' : spentPercentage > 70 ? 'bg-yellow-500' : 'bg-accent-green'}`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </View>
        <Text className="text-gray-400 text-xs mt-2 text-center">
          {spentPercentage.toFixed(0)}% of budget used
        </Text>
      </View>

      {/* Add Expense Button */}
      <TouchableOpacity 
        className="mx-4 bg-accent-green rounded-2xl p-4 mb-4 flex-row items-center justify-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-primary-black text-lg font-bold">+ Add New Expense</Text>
      </TouchableOpacity>

      {/* Expense List */}
      <FlatList
        data={expenses.sort((a, b) => new Date(b.date) - new Date(a.date))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem item={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-5xl mb-4">🧾</Text>
            <Text className="text-gray-400 text-center">No expenses yet.{'\n'}Start tracking your spending!</Text>
          </View>
        }
      />

      {/* Add Expense Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface-dark rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-bold">Add Expense</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-400 text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="bg-primary-dark text-white p-4 rounded-xl mb-3 border border-gray-700"
              placeholder="What did you spend on?"
              placeholderTextColor="#666"
              value={newExpense.title}
              onChangeText={(text) => setNewExpense({...newExpense, title: text})}
            />

            <View className="flex-row items-center bg-primary-dark rounded-xl mb-3 border border-gray-700">
              <Text className="text-white text-xl pl-4">$</Text>
              <TextInput
                className="flex-1 text-white p-4 text-xl"
                placeholder="0.00"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
              />
            </View>

            <Text className="text-gray-400 text-sm mb-2">Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  className={`mr-2 px-4 py-3 rounded-xl flex-row items-center ${
                    newExpense.category === cat.key 
                      ? 'bg-accent-green' 
                      : 'bg-primary-dark border border-gray-700'
                  }`}
                  onPress={() => setNewExpense({...newExpense, category: cat.key})}
                >
                  <Text className="mr-2">{cat.emoji}</Text>
                  <Text className={newExpense.category === cat.key ? 'text-primary-black font-medium' : 'text-white'}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              className="bg-primary-dark text-white p-4 rounded-xl mb-4 border border-gray-700"
              placeholder="Notes (optional)"
              placeholderTextColor="#666"
              value={newExpense.notes}
              onChangeText={(text) => setNewExpense({...newExpense, notes: text})}
            />

            <TouchableOpacity 
              className="bg-accent-green rounded-xl p-4"
              onPress={handleAddExpense}
            >
              <Text className="text-primary-black text-center text-lg font-bold">Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
