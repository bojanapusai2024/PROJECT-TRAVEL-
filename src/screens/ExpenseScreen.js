import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, Text, ScrollView, TextInput, TouchableOpacity, 
  Modal, FlatList, StyleSheet, Animated, Pressable, Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTravelContext } from '../context/TravelContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { key: 'accommodation', label: 'Accommodation', emoji: '🏨', color: '#8B5CF6' },
  { key: 'transport', label: 'Transport', emoji: '🚗', color: '#3B82F6' },
  { key: 'food', label: 'Food & Drinks', emoji: '🍽️', color: '#F59E0B' },
  { key: 'activities', label: 'Activities', emoji: '🎭', color: '#10B981' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#EC4899' },
  { key: 'other', label: 'Other', emoji: '📦', color: '#6B7280' },
];

export default function ExpenseScreen() {
  const { expenses, addExpense, deleteExpense, getTotalExpenses, budget, getRemainingBudget, getExpensesByCategory, formatCurrency, currency } = useTravelContext();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [newExpense, setNewExpense] = useState({
    title: '', amount: '', category: 'food',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), 
    notes: ''
  });

  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleAddExpense = () => {
    if (newExpense.title && newExpense.amount) {
      addExpense({ ...newExpense, amount: parseFloat(newExpense.amount) });
      setNewExpense({ 
        title: '', amount: '', category: 'food', 
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), 
        notes: '' 
      });
      setModalVisible(false);
    }
  };

  const getCategoryInfo = (key) => CATEGORIES.find(c => c.key === key) || CATEGORIES[5];
  const remainingBudget = getRemainingBudget();
  const totalExpenses = getTotalExpenses();
  const spentPercentage = budget.total > 0 ? (totalExpenses / budget.total) * 100 : 0;
  const expensesByCategory = getExpensesByCategory();

  // Filter expenses
  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(e => e.category === filterCategory);

  // Sort by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  // Group expenses by date
  const groupedExpenses = sortedExpenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});

  const dateGroups = Object.keys(groupedExpenses);

  // Daily average
  const uniqueDates = [...new Set(expenses.map(e => e.date))];
  const dailyAverage = uniqueDates.length > 0 ? (totalExpenses / uniqueDates.length).toFixed(0) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Expenses</Text>
            <Text style={styles.headerSubtitle}>Track your spending</Text>
          </View>
          <Pressable 
            style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonIcon}>+</Text>
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Overview Card */}
        <Animated.View style={[styles.overviewCard, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.overviewGlow} />
          
          {/* Main Stats */}
          <View style={styles.overviewMain}>
            <View style={styles.overviewLeft}>
              <Text style={styles.overviewLabel}>Total Spent</Text>
              <Text style={styles.overviewAmount}>{formatCurrency(totalExpenses)}</Text>
              <View style={styles.overviewBudgetInfo}>
                <Text style={styles.overviewBudgetText}>
                  of {formatCurrency(budget.total)} budget
                </Text>
              </View>
            </View>
            <View style={styles.overviewRight}>
              <View style={styles.circularProgress}>
                <View style={styles.circularInner}>
                  <Text style={styles.circularPercent}>{Math.min(spentPercentage, 100).toFixed(0)}%</Text>
                  <Text style={styles.circularLabel}>used</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(spentPercentage, 100)}%`,
                    backgroundColor: spentPercentage > 90 ? '#EF4444' : spentPercentage > 70 ? '#F59E0B' : colors.primary
                  }
                ]} 
              />
            </View>
          </View>

          {/* Quick Stats Row */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <View style={[styles.quickStatIcon, { backgroundColor: colors.primary + '20' }]}>
                <Text style={styles.quickStatEmoji}>💵</Text>
              </View>
              <View>
                <Text style={styles.quickStatValue}>{formatCurrency(remainingBudget)}</Text>
                <Text style={styles.quickStatLabel}>Remaining</Text>
              </View>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <View style={[styles.quickStatIcon, { backgroundColor: '#F59E0B20' }]}>
                <Text style={styles.quickStatEmoji}>📊</Text>
              </View>
              <View>
                <Text style={styles.quickStatValue}>{formatCurrency(dailyAverage)}</Text>
                <Text style={styles.quickStatLabel}>Daily Avg</Text>
              </View>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <View style={[styles.quickStatIcon, { backgroundColor: '#8B5CF620' }]}>
                <Text style={styles.quickStatEmoji}>🧾</Text>
              </View>
              <View>
                <Text style={styles.quickStatValue}>{expenses.length}</Text>
                <Text style={styles.quickStatLabel}>Transactions</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Category Breakdown */}
        <Animated.View style={[styles.categorySection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>📊 Spending by Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const spent = expensesByCategory[cat.key] || 0;
              const percentage = totalExpenses > 0 ? ((spent / totalExpenses) * 100).toFixed(0) : 0;
              return (
                <Pressable 
                  key={cat.key} 
                  style={({ pressed }) => [
                    styles.categoryCard,
                    filterCategory === cat.key && styles.categoryCardActive,
                    pressed && { opacity: 0.8 }
                  ]}
                  onPress={() => setFilterCategory(filterCategory === cat.key ? 'all' : cat.key)}
                >
                  <View style={[styles.categoryIconBg, { backgroundColor: cat.color + '20' }]}>
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  </View>
                  <Text style={styles.categoryName}>{cat.label}</Text>
                  <Text style={[styles.categoryAmount, { color: cat.color }]}>{formatCurrency(spent)}</Text>
                  <View style={styles.categoryProgressBar}>
                    <View style={[styles.categoryProgressFill, { width: `${percentage}%`, backgroundColor: cat.color }]} />
                  </View>
                  <Text style={styles.categoryPercent}>{percentage}%</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Filter Chips */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <Pressable 
              style={[styles.filterChip, filterCategory === 'all' && styles.filterChipActive]}
              onPress={() => setFilterCategory('all')}
            >
              <Text style={[styles.filterChipText, filterCategory === 'all' && styles.filterChipTextActive]}>
                🌟 All ({expenses.length})
              </Text>
            </Pressable>
            {CATEGORIES.map((cat) => {
              const count = expenses.filter(e => e.category === cat.key).length;
              if (count === 0) return null;
              return (
                <Pressable 
                  key={cat.key}
                  style={[styles.filterChip, filterCategory === cat.key && { backgroundColor: cat.color, borderColor: cat.color }]}
                  onPress={() => setFilterCategory(filterCategory === cat.key ? 'all' : cat.key)}
                >
                  <Text style={[styles.filterChipText, filterCategory === cat.key && { color: '#FFF' }]}>
                    {cat.emoji} {cat.label} ({count})
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Expenses List */}
        <View style={styles.expensesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💳 Transactions</Text>
            <Text style={styles.sectionCount}>{filteredExpenses.length} items</Text>
          </View>

          {filteredExpenses.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Text style={styles.emptyEmoji}>💸</Text>
              </View>
              <Text style={styles.emptyTitle}>
                {filterCategory === 'all' ? 'No expenses yet' : `No ${getCategoryInfo(filterCategory).label.toLowerCase()} expenses`}
              </Text>
              <Text style={styles.emptyText}>
                {filterCategory === 'all' ? 'Start tracking your spending' : 'Try selecting a different category'}
              </Text>
              {filterCategory === 'all' && (
                <Pressable style={styles.emptyButton} onPress={() => setModalVisible(true)}>
                  <Text style={styles.emptyButtonText}>+ Add First Expense</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View style={styles.expensesList}>
              {dateGroups.map((date, groupIndex) => (
                <View key={date} style={styles.dateGroup}>
                  {/* Date Header */}
                  <View style={styles.dateHeader}>
                    <View style={styles.dateBadge}>
                      <Text style={styles.dateText}>{date}</Text>
                    </View>
                    <View style={styles.dateLine} />
                    <Text style={styles.dateTotalText}>
                      {formatCurrency(groupedExpenses[date].reduce((sum, e) => sum + e.amount, 0))}
                    </Text>
                  </View>

                  {/* Expenses for this date */}
                  {groupedExpenses[date].map((expense, index) => {
                    const category = getCategoryInfo(expense.category);
                    const isLast = index === groupedExpenses[date].length - 1;
                    
                    return (
                      <Animated.View 
                        key={expense.id} 
                        style={[styles.expenseCard, { borderLeftColor: category.color }]}
                      >
                        <View style={styles.expenseRow}>
                          <View style={[styles.expenseIconBg, { backgroundColor: category.color + '20' }]}>
                            <Text style={styles.expenseEmoji}>{category.emoji}</Text>
                          </View>
                          <View style={styles.expenseInfo}>
                            <Text style={styles.expenseTitle}>{expense.title}</Text>
                            <View style={styles.expenseMeta}>
                              <View style={[styles.expenseCategoryBadge, { backgroundColor: category.color + '15' }]}>
                                <Text style={[styles.expenseCategoryText, { color: category.color }]}>{category.label}</Text>
                              </View>
                              {expense.notes && (
                                <Text style={styles.expenseNotes} numberOfLines={1}>📝 {expense.notes}</Text>
                              )}
                            </View>
                          </View>
                          <View style={styles.expenseRight}>
                            <Text style={styles.expenseAmount}>-{formatCurrency(expense.amount)}</Text>
                            <Pressable 
                              style={styles.deleteButton}
                              onPress={() => deleteExpense(expense.id)}
                            >
                              <Text style={styles.deleteButtonText}>🗑️</Text>
                            </Pressable>
                          </View>
                        </View>
                      </Animated.View>
                    );
                  })}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable 
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.9, transform: [{ scale: 0.95 }] }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Add Expense</Text>
      </Pressable>

      {/* Add Expense Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Expense</Text>
                <Text style={styles.modalSubtitle}>Track your spending</Text>
              </View>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Text style={styles.modalCloseText}>×</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Amount Input - Prominent */}
              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>Amount</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.amountCurrency}>{currency.symbol}</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="decimal-pad"
                    value={newExpense.amount}
                    onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
                  />
                </View>
              </View>

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>What did you spend on?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Dinner, Train ticket, Museum entry"
                  placeholderTextColor={colors.textMuted}
                  value={newExpense.title}
                  onChangeText={(text) => setNewExpense({...newExpense, title: text})}
                />
              </View>

              {/* Category Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categorySelectGrid}>
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat.key}
                      style={[
                        styles.categorySelectItem,
                        newExpense.category === cat.key && { backgroundColor: cat.color, borderColor: cat.color }
                      ]}
                      onPress={() => setNewExpense({...newExpense, category: cat.key})}
                    >
                      <Text style={styles.categorySelectEmoji}>{cat.emoji}</Text>
                      <Text style={styles.categorySelectText}>{cat.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes (optional)</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Add any details..."
                  placeholderTextColor={colors.textMuted}
                  value={newExpense.notes}
                  onChangeText={(text) => setNewExpense({...newExpense, notes: text})}
                  multiline
                />
              </View>

              {/* Submit Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  (!newExpense.title || !newExpense.amount) && styles.submitButtonDisabled,
                  pressed && { opacity: 0.8 }
                ]}
                onPress={handleAddExpense}
                disabled={!newExpense.title || !newExpense.amount}
              >
                <Text style={styles.submitButtonText}>Add Expense</Text>
              </Pressable>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { color: colors.text, fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { color: colors.textMuted, fontSize: 14, marginTop: 4 },
  addButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  addButtonIcon: { color: colors.bg, fontSize: 24, fontWeight: 'bold' },

  // Overview Card
  overviewCard: { 
    marginHorizontal: 20, 
    backgroundColor: colors.card, 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    overflow: 'hidden',
  },
  overviewGlow: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, backgroundColor: colors.primary, opacity: 0.08, borderRadius: 60 },
  overviewMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  overviewLeft: {},
  overviewLabel: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  overviewAmount: { color: colors.text, fontSize: 36, fontWeight: 'bold' },
  overviewBudgetInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  overviewBudgetText: { color: colors.textMuted, fontSize: 13 },
  overviewRight: {},
  circularProgress: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  circularInner: { alignItems: 'center' },
  circularPercent: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
  circularLabel: { color: colors.textMuted, fontSize: 10 },
  
  progressSection: { marginBottom: 16 },
  progressBar: { height: 8, backgroundColor: colors.cardLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },

  quickStats: { flexDirection: 'row', backgroundColor: colors.cardLight, borderRadius: 16, padding: 14 },
  quickStatItem: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  quickStatIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  quickStatEmoji: { fontSize: 16 },
  quickStatValue: { color: colors.text, fontSize: 15, fontWeight: 'bold' },
  quickStatLabel: { color: colors.textMuted, fontSize: 10 },
  quickStatDivider: { width: 1, backgroundColor: colors.primaryBorder, marginHorizontal: 8 },

  // Category Section
  categorySection: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { 
    width: (width - 60) / 3, 
    backgroundColor: colors.card, 
    borderRadius: 14, 
    padding: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  categoryCardActive: { borderColor: colors.primary, borderWidth: 2 },
  categoryIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryEmoji: { fontSize: 20 },
  categoryName: { color: colors.textMuted, fontSize: 10, textAlign: 'center', marginBottom: 4 },
  categoryAmount: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  categoryProgressBar: { width: '100%', height: 3, backgroundColor: colors.cardLight, borderRadius: 2, overflow: 'hidden' },
  categoryProgressFill: { height: '100%', borderRadius: 2 },
  categoryPercent: { color: colors.textMuted, fontSize: 10, marginTop: 4 },

  // Filter Section
  filterSection: { marginBottom: 16 },
  filterScroll: { paddingHorizontal: 20, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.primaryBorder },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { color: colors.text, fontSize: 12, fontWeight: '500' },
  filterChipTextActive: { color: colors.bg },

  // Expenses Section
  expensesSection: { paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionCount: { color: colors.textMuted, fontSize: 13 },

  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIconBg: { width: 80, height: 80, borderRadius: 24, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: colors.primaryBorder },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '600' },
  emptyText: { color: colors.textMuted, fontSize: 14, marginTop: 8, textAlign: 'center' },
  emptyButton: { marginTop: 20, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyButtonText: { color: colors.bg, fontSize: 14, fontWeight: 'bold' },

  // Expenses List
  expensesList: { gap: 16 },
  dateGroup: {},
  dateHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dateBadge: { backgroundColor: colors.primaryMuted, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  dateText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  dateLine: { flex: 1, height: 1, backgroundColor: colors.primaryBorder, marginHorizontal: 12 },
  dateTotalText: { color: colors.textMuted, fontSize: 12, fontWeight: '500' },

  expenseCard: { 
    backgroundColor: colors.card, 
    borderRadius: 16, 
    padding: 14, 
    marginBottom: 10,
    borderWidth: 1, 
    borderColor: colors.primaryBorder, 
    borderLeftWidth: 4,
  },
  expenseRow: { flexDirection: 'row', alignItems: 'center' },
  expenseIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  expenseEmoji: { fontSize: 20 },
  expenseInfo: { flex: 1, marginLeft: 12 },
  expenseTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  expenseMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8, flexWrap: 'wrap' },
  expenseCategoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  expenseCategoryText: { fontSize: 10, fontWeight: '600' },
  expenseNotes: { color: colors.textMuted, fontSize: 11, flex: 1 },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { color: '#EF4444', fontSize: 17, fontWeight: 'bold' },
  deleteButton: { marginTop: 6, padding: 4 },
  deleteButtonText: { fontSize: 14 },

  // FAB
  fab: { 
    position: 'absolute', 
    bottom: 20, 
    right: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.primary, 
    paddingVertical: 14, 
    paddingHorizontal: 20, 
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: { color: colors.bg, fontSize: 20, fontWeight: 'bold', marginRight: 8 },
  fabText: { color: colors.bg, fontSize: 15, fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, paddingHorizontal: 24, paddingBottom: 20, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, backgroundColor: colors.textMuted, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalTitle: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
  modalSubtitle: { color: colors.textMuted, fontSize: 14, marginTop: 4 },
  modalClose: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.cardLight, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { color: colors.textMuted, fontSize: 22 },

  // Amount Section
  amountSection: { backgroundColor: colors.cardLight, borderRadius: 20, padding: 24, marginBottom: 20, alignItems: 'center' },
  amountLabel: { color: colors.textMuted, fontSize: 14, marginBottom: 12 },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center' },
  amountCurrency: { color: colors.text, fontSize: 36, fontWeight: 'bold', marginRight: 4 },
  amountInput: { color: colors.text, fontSize: 48, fontWeight: 'bold', minWidth: 100, textAlign: 'center' },

  // Input Groups
  inputGroup: { marginBottom: 18 },
  inputLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '500', marginBottom: 8 },
  input: { backgroundColor: colors.cardLight, color: colors.text, padding: 16, borderRadius: 14, fontSize: 16, borderWidth: 1, borderColor: colors.primaryBorder },
  notesInput: { height: 80, textAlignVertical: 'top' },

  // Category Select
  categorySelectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categorySelectItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.cardLight, 
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.primaryBorder,
  },
  categorySelectEmoji: { fontSize: 18, marginRight: 8 },
  categorySelectText: { color: colors.text, fontSize: 13, fontWeight: '500' },

  // Submit
  submitButton: { backgroundColor: colors.primary, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: colors.bg, fontSize: 17, fontWeight: 'bold' },
});
