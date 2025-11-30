import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTravelContext } from '../context/TravelContext';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = [
  { key: 'accommodation', label: 'Accommodation', emoji: '🏨', color: '#8B5CF6' },
  { key: 'transport', label: 'Transport', emoji: '🚗', color: '#3B82F6' },
  { key: 'food', label: 'Food & Drinks', emoji: '🍽️', color: '#F59E0B' },
  { key: 'activities', label: 'Activities', emoji: '🎭', color: '#10B981' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#EC4899' },
  { key: 'other', label: 'Other', emoji: '📦', color: '#6B7280' },
];

export default function BudgetScreen() {
  const { budget, setBudget, getExpensesByCategory } = useTravelContext();
  const { colors } = useTheme();
  const [totalBudget, setTotalBudget] = useState(budget.total.toString());
  const [editingCategory, setEditingCategory] = useState(null);
  const expensesByCategory = getExpensesByCategory();

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSaveBudget = () => {
    setBudget({ ...budget, total: parseFloat(totalBudget) || 0 });
  };

  const updateCategoryBudget = (category, value) => {
    setBudget({
      ...budget,
      categories: { ...budget.categories, [category]: parseFloat(value) || 0 }
    });
  };

  const allocatedTotal = Object.values(budget.categories).reduce((sum, val) => sum + val, 0);
  const unallocated = budget.total - allocatedTotal;
  const totalSpent = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Budget</Text>
          <Text style={styles.headerSubtitle}>Plan your travel spending</Text>
        </Animated.View>

        {/* Total Budget Card */}
        <Animated.View style={[styles.totalCard, { opacity: fadeAnim }]}>
          <View style={styles.totalCardGlow} />
          <View style={styles.totalCardHeader}>
            <View style={styles.totalIconBg}>
              <Text style={styles.totalIcon}>💰</Text>
            </View>
            <Text style={styles.totalLabel}>Total Trip Budget</Text>
          </View>
          <View style={styles.totalInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.totalInput}
              keyboardType="numeric"
              value={totalBudget}
              onChangeText={setTotalBudget}
              onBlur={handleSaveBudget}
              placeholderTextColor={colors.textMuted}
              placeholder="0"
            />
          </View>
          
          {/* Budget Summary */}
          <View style={styles.budgetSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>${allocatedTotal}</Text>
              <Text style={styles.summaryLabel}>Allocated</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: unallocated >= 0 ? colors.primary : '#EF4444' }]}>${unallocated}</Text>
              <Text style={styles.summaryLabel}>Unallocated</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>${totalSpent}</Text>
              <Text style={styles.summaryLabel}>Spent</Text>
            </View>
          </View>
        </Animated.View>

        {/* Category Breakdown */}
        <Animated.View style={[styles.categoriesSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>📊 Budget by Category</Text>
          
          {CATEGORIES.map((category, index) => {
            const allocated = budget.categories[category.key] || 0;
            const spent = expensesByCategory[category.key] || 0;
            const percentage = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
            const isEditing = editingCategory === category.key;
            
            return (
              <Animated.View 
                key={category.key} 
                style={[styles.categoryCard, { borderLeftColor: category.color }]}
              >
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryIconBg, { backgroundColor: category.color + '20' }]}>
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={styles.categoryLabel}>{category.label}</Text>
                      <Text style={styles.categorySpent}>
                        ${spent} spent of ${allocated}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.categoryInputWrapper}
                    onPress={() => setEditingCategory(category.key)}
                  >
                    <Text style={styles.categoryDollar}>$</Text>
                    <TextInput
                      style={styles.categoryInput}
                      keyboardType="numeric"
                      value={allocated.toString()}
                      onChangeText={(text) => updateCategoryBudget(category.key, text)}
                      onFocus={() => setEditingCategory(category.key)}
                      onBlur={() => setEditingCategory(null)}
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.categoryProgress}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${percentage}%`, 
                          backgroundColor: percentage > 90 ? '#EF4444' : category.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressPercent}>{percentage.toFixed(0)}%</Text>
                </View>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Budget Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Allocate 30-40% for accommodation</Text>
            <Text style={styles.tipItem}>• Keep 10% as emergency fund</Text>
            <Text style={styles.tipItem}>• Track daily to stay on budget</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingBottom: 20 },
  
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { color: colors.text, fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { color: colors.textMuted, fontSize: 14, marginTop: 4 },

  // Total Card
  totalCard: { marginHorizontal: 20, backgroundColor: colors.primary, borderRadius: 24, padding: 24, marginBottom: 24, overflow: 'hidden' },
  totalCardGlow: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, backgroundColor: '#FFFFFF', opacity: 0.1, borderRadius: 60 },
  totalCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  totalIconBg: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  totalIcon: { fontSize: 22 },
  totalLabel: { color: 'rgba(0,0,0,0.6)', fontSize: 14, fontWeight: '600', marginLeft: 12 },
  totalInputContainer: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { color: colors.bg, fontSize: 32, fontWeight: 'bold', marginRight: 4 },
  totalInput: { flex: 1, color: colors.bg, fontSize: 42, fontWeight: 'bold', padding: 0 },
  
  budgetSummary: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, marginTop: 20 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { color: colors.bg, fontSize: 18, fontWeight: 'bold' },
  summaryLabel: { color: 'rgba(0,0,0,0.5)', fontSize: 11, marginTop: 4 },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  // Categories
  categoriesSection: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  
  categoryCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.primaryBorder, borderLeftWidth: 4 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  categoryInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  categoryEmoji: { fontSize: 20 },
  categoryText: { marginLeft: 12, flex: 1 },
  categoryLabel: { color: colors.text, fontSize: 15, fontWeight: '600' },
  categorySpent: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  categoryInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardLight, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  categoryDollar: { color: colors.textMuted, fontSize: 16 },
  categoryInput: { color: colors.text, fontSize: 16, fontWeight: '600', width: 60, textAlign: 'right', padding: 0 },
  
  categoryProgress: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBar: { flex: 1, height: 8, backgroundColor: colors.cardLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressPercent: { color: colors.textMuted, fontSize: 12, width: 36, textAlign: 'right' },

  // Tips
  tipsCard: { marginHorizontal: 20, backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.primaryBorder },
  tipsTitle: { color: colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  tipsList: { gap: 8 },
  tipItem: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
});
