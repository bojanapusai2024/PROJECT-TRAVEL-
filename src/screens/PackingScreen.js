import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTravelContext } from '../context/TravelContext';

const ITEM_CATEGORIES = [
  { key: 'clothing', label: 'Clothing', emoji: '👕' },
  { key: 'toiletries', label: 'Toiletries', emoji: '🧴' },
  { key: 'electronics', label: 'Electronics', emoji: '📱' },
  { key: 'documents', label: 'Documents', emoji: '📄' },
  { key: 'accessories', label: 'Accessories', emoji: '👜' },
  { key: 'medication', label: 'Medication', emoji: '💊' },
  { key: 'other', label: 'Other', emoji: '📦' },
];

const QUICK_ADD_ITEMS = [
  { name: 'Passport', category: 'documents' },
  { name: 'Phone Charger', category: 'electronics' },
  { name: 'Toothbrush', category: 'toiletries' },
  { name: 'T-Shirts', category: 'clothing' },
  { name: 'Underwear', category: 'clothing' },
  { name: 'Sunglasses', category: 'accessories' },
  { name: 'Medications', category: 'medication' },
  { name: 'Wallet', category: 'documents' },
];

export default function PackingScreen() {
  const { packingItems, addPackingItem, togglePackingItem, deletePackingItem } = useTravelContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newItem, setNewItem] = useState({ name: '', category: 'clothing', quantity: '1' });

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      addPackingItem({
        name: newItem.name,
        category: newItem.category,
        quantity: parseInt(newItem.quantity) || 1
      });
      setNewItem({ name: '', category: 'clothing', quantity: '1' });
      setModalVisible(false);
    }
  };

  const handleQuickAdd = (item) => {
    addPackingItem({
      name: item.name,
      category: item.category,
      quantity: 1
    });
  };

  const filteredItems = selectedCategory === 'all' 
    ? packingItems 
    : packingItems.filter(item => item.category === selectedCategory);

  const packedCount = packingItems.filter(item => item.packed).length;
  const totalCount = packingItems.length;
  const progressPercentage = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  const getCategoryEmoji = (key) => ITEM_CATEGORIES.find(c => c.key === key)?.emoji || '📦';

  const PackingItem = ({ item }) => (
    <View className={`bg-surface-card rounded-2xl p-4 mb-2 border ${item.packed ? 'border-accent-green/50' : 'border-gray-700'}`}>
      <View className="flex-row items-center">
        <TouchableOpacity 
          onPress={() => togglePackingItem(item.id)}
          className={`w-7 h-7 rounded-full border-2 mr-3 items-center justify-center ${
            item.packed ? 'bg-accent-green border-accent-green' : 'border-gray-500'
          }`}
        >
          {item.packed && <Text className="text-primary-black text-sm">✓</Text>}
        </TouchableOpacity>
        
        <Text className="text-xl mr-3">{getCategoryEmoji(item.category)}</Text>
        
        <View className="flex-1">
          <Text className={`font-medium ${item.packed ? 'text-gray-400 line-through' : 'text-white'}`}>
            {item.name}
          </Text>
          {item.quantity > 1 && (
            <Text className="text-gray-500 text-xs">Qty: {item.quantity}</Text>
          )}
        </View>
        
        <TouchableOpacity onPress={() => deletePackingItem(item.id)}>
          <Text className="text-red-400 text-lg">🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 mt-4 mb-4">
          <Text className="text-white text-3xl font-bold">Packing List 🎒</Text>
          <Text className="text-gray-400 mt-1">Never forget essentials again</Text>
        </View>

        {/* Progress Card */}
        <View className="mx-4 bg-surface-card rounded-3xl p-5 mb-4 border border-accent-green/30">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-lg font-semibold">Packing Progress</Text>
            <Text className="text-accent-green font-bold">{packedCount}/{totalCount}</Text>
          </View>
          <View className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <View 
              className="h-full bg-accent-green rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
          <Text className="text-gray-400 text-center text-sm mt-2">
            {progressPercentage === 100 ? '🎉 All packed!' : `${progressPercentage.toFixed(0)}% complete`}
          </Text>
        </View>

        {/* Quick Add */}
        <View className="px-4 mb-4">
          <Text className="text-white text-sm font-semibold mb-2">Quick Add</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {QUICK_ADD_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-secondary-purple/20 border border-secondary-purple/30 rounded-full px-4 py-2 mr-2"
                onPress={() => handleQuickAdd(item)}
              >
                <Text className="text-secondary-purple text-sm">+ {item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Filter */}
        <View className="px-4 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedCategory === 'all' ? 'bg-accent-green' : 'bg-surface-card border border-gray-700'
              }`}
              onPress={() => setSelectedCategory('all')}
            >
              <Text className={selectedCategory === 'all' ? 'text-primary-black font-medium' : 'text-white'}>
                All ({packingItems.length})
              </Text>
            </TouchableOpacity>
            {ITEM_CATEGORIES.map((cat) => {
              const count = packingItems.filter(i => i.category === cat.key).length;
              if (count === 0) return null;
              return (
                <TouchableOpacity
                  key={cat.key}
                  className={`mr-2 px-4 py-2 rounded-full flex-row items-center ${
                    selectedCategory === cat.key ? 'bg-accent-green' : 'bg-surface-card border border-gray-700'
                  }`}
                  onPress={() => setSelectedCategory(cat.key)}
                >
                  <Text className="mr-1">{cat.emoji}</Text>
                  <Text className={selectedCategory === cat.key ? 'text-primary-black font-medium' : 'text-white'}>
                    {count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Add Item Button */}
        <TouchableOpacity 
          className="mx-4 bg-accent-green rounded-2xl p-4 mb-4 flex-row items-center justify-center"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-primary-black text-lg font-bold">+ Add Custom Item</Text>
        </TouchableOpacity>

        {/* Items List */}
        <View className="px-4 pb-24">
          {filteredItems.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-5xl mb-4">📦</Text>
              <Text className="text-gray-400 text-center">No items yet.{'\n'}Start adding things to pack!</Text>
            </View>
          ) : (
            <>
              {/* Unpacked Items */}
              {filteredItems.filter(i => !i.packed).length > 0 && (
                <Text className="text-gray-400 text-sm mb-2">To Pack</Text>
              )}
              {filteredItems.filter(i => !i.packed).map(item => (
                <PackingItem key={item.id} item={item} />
              ))}
              
              {/* Packed Items */}
              {filteredItems.filter(i => i.packed).length > 0 && (
                <Text className="text-gray-400 text-sm mb-2 mt-4">Packed ✓</Text>
              )}
              {filteredItems.filter(i => i.packed).map(item => (
                <PackingItem key={item.id} item={item} />
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface-dark rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-bold">Add Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-400 text-2xl">✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="bg-primary-dark text-white p-4 rounded-xl mb-3 border border-gray-700"
              placeholder="Item name"
              placeholderTextColor="#666"
              value={newItem.name}
              onChangeText={(text) => setNewItem({...newItem, name: text})}
            />

            <View className="flex-row mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-gray-400 text-sm mb-2">Quantity</Text>
                <TextInput
                  className="bg-primary-dark text-white p-4 rounded-xl border border-gray-700"
                  placeholder="1"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={newItem.quantity}
                  onChangeText={(text) => setNewItem({...newItem, quantity: text})}
                />
              </View>
            </View>

            <Text className="text-gray-400 text-sm mb-2">Category</Text>
            <View className="flex-row flex-wrap mb-4">
              {ITEM_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  className={`mr-2 mb-2 px-4 py-3 rounded-xl flex-row items-center ${
                    newItem.category === cat.key 
                      ? 'bg-accent-green' 
                      : 'bg-primary-dark border border-gray-700'
                  }`}
                  onPress={() => setNewItem({...newItem, category: cat.key})}
                >
                  <Text className="mr-2">{cat.emoji}</Text>
                  <Text className={newItem.category === cat.key ? 'text-primary-black font-medium' : 'text-white'}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              className="bg-accent-green rounded-xl p-4"
              onPress={handleAddItem}
            >
              <Text className="text-primary-black text-center text-lg font-bold">Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
