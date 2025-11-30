import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Animated, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTravelContext } from '../context/TravelContext';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = [
  { key: 'accommodation', label: 'Stay', emoji: '🏨', color: '#8B5CF6' },
  { key: 'transport', label: 'Transport', emoji: '🚗', color: '#3B82F6' },
  { key: 'food', label: 'Food', emoji: '🍽️', color: '#F59E0B' },
  { key: 'activities', label: 'Activities', emoji: '🎭', color: '#10B981' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#EC4899' },
  { key: 'other', label: 'Other', emoji: '📦', color: '#6B7280' },
];

export default function ExpenseScreen() {
  const { expenses, addExpense, deleteExpense, getTotalExpenses, budget, getRemainingBudget } = useTravelContext();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '', amount: '', category: 'food',
    date: new Date().toLocaleDateString(), notes: ''
  });

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleAddExpense = () => {
    if (newExpense.title && newExpense.amount) {
      addExpense({ ...newExpense, amount: parseFloat(newExpense.amount) });
      setNewExpense({ title: '', amount: '', category: 'food', date: new Date().toLocaleDateString(), notes: '' });
      setModalVisible(false);
    }
  };

  const getCategoryInfo = (key) => CATEGORIES.find(c => c.key === key) || CATEGORIES[5];
  const remainingBudget = getRemainingBudget();
  const totalExpenses = getTotalExpenses();
  const spentPercentage = budget.total > 0 ? (totalExpenses / budget.total) * 100 : 0;

  const ExpenseItem = ({ item, index }) => {
    const category = getCategoryInfo(item.category);
    return (
      <Animated.View style={[styles.expenseCard, { borderLeftColor: category.color }]}>
        <View style={styles.expenseRow}>
          <View style={[styles.expenseIconBg, { backgroundColor: category.color + '20' }]}>
            <Text style={styles.expenseEmoji}>{category.emoji}</Text>
          </View>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseTitle}>{item.title}</Text>
            <View style={styles.expenseMeta}>
              <Text style={[styles.expenseCategory, { color: category.color }]}>{category.label}</Text>
              <Text style={styles.expenseDate}>• {item.date}</Text>
            </View>
          </View>
          <View style={styles.expenseRight}>
            <Text style={styles.expenseAmount}>-${item.amount}</Text>
            <TouchableOpacity onPress={() => deleteExpense(item.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <Text style={styles.headerSubtitle}>Track your spending</Text>
      </Animated.View>

      {/* Summary Card */}
      <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
        <View style={styles.summaryGlow} />
        <View style={styles.summaryTop}>
          <View style={styles.summaryMain}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summarySpent}>${totalExpenses}</Text>
          </View>
          <View style={styles.summarySecondary}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryRemaining, { color: remainingBudget >= 0 ? colors.primary : '#EF4444' }]}>
              ${remainingBudget}
            </Text>
          </View>
        </View>
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(spentPercentage, 100)}%`, backgroundColor: spentPercentage > 90 ? '#EF4444' : colors.primary }]} />
          </View>
          <Text style={styles.progressText}>{spentPercentage.toFixed(0)}% of ${budget.total} budget</Text>
        </View>
      </Animated.View>

      {/* Add Button */}
      <Pressable style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.8 }]} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonIcon}>+</Text>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </Pressable>

      {/* Expenses List */}
      <FlatList
        data={expenses.sort((a, b) => new Date(b.date) - new Date(a.date))}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <ExpenseItem item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💸</Text>
            <Text style={styles.emptyTitle}>No expenses yet</Text>
            <Text style={styles.emptyText}>Tap "Add Expense" to start tracking</Text>
          </View>
        }
      />

      {/* Add Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>What did you spend on?</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g., Dinner at local restaurant" 
                  placeholderTextColor={colors.textMuted} 
                  value={newExpense.title} 
                  onChangeText={(text) => setNewExpense({...newExpense, title: text})} 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount</Text>
                <View style={styles.amountInput}>
                  <Text style={styles.amountDollar}>$</Text>
                  <TextInput 
                    style={styles.amountField} 
                    placeholder="0.00" 
                    placeholderTextColor={colors.textMuted} 
                    keyboardType="numeric" 
                    value={newExpense.amount} 
                    onChangeText={(text) => setNewExpense({...newExpense, amount: text})} 
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map((cat) => (
                    <Pressable 
                      key={cat.key} 
                      style={[styles.categoryChip, newExpense.category === cat.key && { backgroundColor: cat.color, borderColor: cat.color }]} 
                      onPress={() => setNewExpense({...newExpense, category: cat.key})}
                    >
                      <Text style={styles.categoryChipEmoji}>{cat.emoji}</Text>
                      <Text style={[styles.categoryChipText, newExpense.category === cat.key && { color: '#FFF' }]}>{cat.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable 
                style={({ pressed }) => [styles.submitButton, (!newExpense.title || !newExpense.amount) && styles.submitButtonDisabled, pressed && { opacity: 0.8 }]} 
                onPress={handleAddExpense}
                disabled={!newExpense.title || !newExpense.amount}
              >
                <Text style={styles.submitButtonText}>Add Expense</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { color: colors.text, fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { color: colors.textMuted, fontSize: 14, marginTop: 4 },

  // Summary
  summaryCard: { marginHorizontal: 20, backgroundColor: colors.card, borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.primaryBorder, overflow: 'hidden' },
  summaryGlow: { position: 'absolute', top: -30, right: -30, width: 100, height: 100, backgroundColor: colors.primary, opacity: 0.1, borderRadius: 50 },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryMain: {},
  summaryLabel: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  summarySpent: { color: colors.text, fontSize: 32, fontWeight: 'bold' },
  summarySecondary: { alignItems: 'flex-end' },
  summaryRemaining: { fontSize: 24, fontWeight: 'bold' },
  progressSection: {},
  progressBar: { height: 10, backgroundColor: colors.cardLight, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  progressText: { color: colors.textMuted, fontSize: 12, marginTop: 8, textAlign: 'center' },

  // Add Button
  addButton: { marginHorizontal: 20, backgroundColor: colors.primary, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  addButtonIcon: { color: colors.bg, fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  addButtonText: { color: colors.bg, fontSize: 16, fontWeight: 'bold' },

  // List
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  expenseCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.primaryBorder, borderLeftWidth: 4 },
  expenseRow: { flexDirection: 'row', alignItems: 'center' },
  expenseIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  expenseEmoji: { fontSize: 22 },
  expenseInfo: { flex: 1, marginLeft: 14 },
  expenseTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  expenseMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  expenseCategory: { fontSize: 12, fontWeight: '600' },
  expenseDate: { color: colors.textMuted, fontSize: 12, marginLeft: 6 },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { color: '#EF4444', fontSize: 18, fontWeight: 'bold' },
  deleteBtn: { marginTop: 4, padding: 4 },
  deleteText: { fontSize: 14 },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '600' },
  emptyText: { color: colors.textMuted, fontSize: 14, marginTop: 8 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '80%' },
  modalHandle: { width: 40, height: 4, backgroundColor: colors.textMuted, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
  modalClose: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.cardLight, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { color: colors.textMuted, fontSize: 16 },
  
  inputGroup: { marginBottom: 20 },
  inputLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '500', marginBottom: 8 },
  input: { backgroundColor: colors.cardLight, color: colors.text, padding: 16, borderRadius: 14, fontSize: 16, borderWidth: 1, borderColor: colors.primaryBorder },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardLight, borderRadius: 14, borderWidth: 1, borderColor: colors.primaryBorder },
  amountDollar: { color: colors.text, fontSize: 24, fontWeight: 'bold', paddingLeft: 16 },
  amountField: { flex: 1, color: colors.text, padding: 16, fontSize: 24, fontWeight: 'bold' },
  
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardLight, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.primaryBorder },
  categoryChipEmoji: { fontSize: 16, marginRight: 6 },
  categoryChipText: { color: colors.text, fontSize: 13, fontWeight: '500' },

  submitButton: { backgroundColor: colors.primary, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 10 },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: colors.bg, fontSize: 17, fontWeight: 'bold' },
});
