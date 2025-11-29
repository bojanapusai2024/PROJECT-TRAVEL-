import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTravelContext } from '../context/TravelContext';

const { width } = Dimensions.get('window');

const COLORS = {
  bg: '#000000',
  card: '#0A0A0A',
  cardLight: '#111111',
  green: '#00FF7F',
  greenMuted: 'rgba(0, 255, 127, 0.1)',
  greenBorder: 'rgba(0, 255, 127, 0.3)',
  text: '#FFFFFF',
  textMuted: '#666666',
  textLight: '#999999',
};

export default function HomeScreen({ onBackToHome }) {
  const { tripInfo, setTripInfo, budget, getTotalExpenses, getRemainingBudget, packingItems, itinerary } = useTravelContext();
  const [isEditing, setIsEditing] = useState(false);

  const packedCount = packingItems.filter(item => item.packed).length;
  const spentPercentage = budget.total > 0 ? (getTotalExpenses() / budget.total) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackToHome} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>{tripInfo.name || 'Your Trip'}</Text>
            <Text style={styles.title}>Dashboard ✈️</Text>
          </View>
          <View style={styles.tripBadge}>
            <Text style={styles.tripBadgeText}>
              {tripInfo.participants?.length > 0 ? `${tripInfo.participants.length + 1}` : '1'}
            </Text>
          </View>
        </View>

        {/* Destination Card */}
        <View style={styles.destinationCard}>
          <View style={styles.destinationGlow} />
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.destinationInput}
                placeholder="Enter destination..."
                placeholderTextColor={COLORS.textMuted}
                value={tripInfo.destination}
                onChangeText={(text) => setTripInfo({...tripInfo, destination: text})}
              />
              <View style={styles.dateInputRow}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="Start date"
                  placeholderTextColor={COLORS.textMuted}
                  value={tripInfo.startDate}
                  onChangeText={(text) => setTripInfo({...tripInfo, startDate: text})}
                />
                <View style={styles.dateArrow}>
                  <Text style={styles.dateArrowText}>→</Text>
                </View>
                <TextInput
                  style={styles.dateInput}
                  placeholder="End date"
                  placeholderTextColor={COLORS.textMuted}
                  value={tripInfo.endDate}
                  onChangeText={(text) => setTripInfo({...tripInfo, endDate: text})}
                />
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.saveButtonText}>Save Trip</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.8}>
              <Text style={styles.destinationLabel}>DESTINATION</Text>
              <Text style={styles.destinationName}>{tripInfo.destination || 'Tap to set destination'}</Text>
              <View style={styles.dateDisplay}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>📅 {tripInfo.startDate || 'Start'} — {tripInfo.endDate || 'End'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Container */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <View>
                <Text style={styles.budgetLabel}>TOTAL BUDGET</Text>
                <Text style={styles.budgetAmount}>${budget.total.toLocaleString()}</Text>
              </View>
              <View style={styles.budgetPercentage}>
                <Text style={styles.percentageText}>{spentPercentage.toFixed(0)}%</Text>
                <Text style={styles.percentageLabel}>spent</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.min(spentPercentage, 100)}%` }]} />
              </View>
            </View>
            <View style={styles.budgetFooter}>
              <View style={styles.budgetStat}>
                <Text style={styles.budgetStatValue}>${getTotalExpenses()}</Text>
                <Text style={styles.budgetStatLabel}>Spent</Text>
              </View>
              <View style={styles.budgetDivider} />
              <View style={styles.budgetStat}>
                <Text style={[styles.budgetStatValue, { color: COLORS.green }]}>${getRemainingBudget()}</Text>
                <Text style={styles.budgetStatLabel}>Remaining</Text>
              </View>
            </View>
          </View>

          <View style={styles.miniStatsRow}>
            <View style={styles.miniStatCard}>
              <View style={styles.miniStatIcon}><Text style={styles.miniStatEmoji}>🎒</Text></View>
              <View style={styles.miniStatContent}>
                <Text style={styles.miniStatValue}>{packedCount}/{packingItems.length}</Text>
                <Text style={styles.miniStatLabel}>Items Packed</Text>
              </View>
            </View>
            <View style={styles.miniStatCard}>
              <View style={styles.miniStatIcon}><Text style={styles.miniStatEmoji}>📍</Text></View>
              <View style={styles.miniStatContent}>
                <Text style={styles.miniStatValue}>{itinerary.length}</Text>
                <Text style={styles.miniStatLabel}>Stops Planned</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Share Card */}
        <View style={styles.shareCard}>
          <View style={styles.shareContent}>
            <Text style={styles.shareTitle}>Share Trip</Text>
            <Text style={styles.shareDescription}>Invite friends with this code</Text>
          </View>
          <View style={styles.codeContainer}>
            <Text style={styles.tripCode}>{tripInfo.tripCode || 'ABC123'}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.greenBorder },
  backButtonText: { color: COLORS.green, fontSize: 24, fontWeight: 'bold' },
  headerContent: { flex: 1, marginLeft: 14 },
  greeting: { color: COLORS.green, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  title: { color: COLORS.text, fontSize: 24, fontWeight: 'bold', marginTop: 2 },
  tripBadge: { width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.greenMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.greenBorder },
  tripBadgeText: { color: COLORS.green, fontSize: 14, fontWeight: 'bold' },
  destinationCard: { marginTop: 16, backgroundColor: COLORS.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: COLORS.greenBorder, overflow: 'hidden' },
  destinationGlow: { position: 'absolute', top: -50, right: -50, width: 150, height: 150, backgroundColor: COLORS.green, opacity: 0.05, borderRadius: 75 },
  destinationLabel: { color: COLORS.green, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  destinationName: { color: COLORS.text, fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  dateDisplay: { marginTop: 16 },
  dateBadge: { backgroundColor: COLORS.greenMuted, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', borderWidth: 1, borderColor: COLORS.greenBorder },
  dateBadgeText: { color: COLORS.green, fontSize: 13, fontWeight: '600' },
  editContainer: { gap: 12 },
  destinationInput: { backgroundColor: COLORS.cardLight, color: COLORS.text, fontSize: 18, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.greenBorder },
  dateInputRow: { flexDirection: 'row', alignItems: 'center' },
  dateInput: { flex: 1, backgroundColor: COLORS.cardLight, color: COLORS.text, fontSize: 14, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.greenBorder },
  dateArrow: { paddingHorizontal: 12 },
  dateArrowText: { color: COLORS.green, fontSize: 18 },
  saveButton: { backgroundColor: COLORS.green, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  saveButtonText: { color: COLORS.bg, fontSize: 16, fontWeight: 'bold' },
  statsContainer: { marginTop: 24 },
  sectionTitle: { color: COLORS.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  budgetCard: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.greenBorder },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  budgetLabel: { color: COLORS.textLight, fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
  budgetAmount: { color: COLORS.text, fontSize: 30, fontWeight: 'bold', marginTop: 4 },
  budgetPercentage: { alignItems: 'flex-end' },
  percentageText: { color: COLORS.green, fontSize: 22, fontWeight: 'bold' },
  percentageLabel: { color: COLORS.textMuted, fontSize: 12 },
  progressContainer: { marginTop: 16 },
  progressTrack: { height: 8, backgroundColor: COLORS.cardLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 4 },
  budgetFooter: { flexDirection: 'row', marginTop: 16, alignItems: 'center' },
  budgetStat: { flex: 1 },
  budgetStatValue: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  budgetStatLabel: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  budgetDivider: { width: 1, height: 36, backgroundColor: COLORS.greenBorder, marginHorizontal: 16 },
  miniStatsRow: { flexDirection: 'row', marginTop: 12, gap: 12 },
  miniStatCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.greenBorder },
  miniStatIcon: { width: 44, height: 44, backgroundColor: COLORS.greenMuted, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  miniStatEmoji: { fontSize: 20 },
  miniStatContent: { marginLeft: 12, flex: 1 },
  miniStatValue: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  miniStatLabel: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  shareCard: { marginTop: 20, backgroundColor: COLORS.card, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.greenBorder },
  shareContent: { flex: 1 },
  shareTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  shareDescription: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  codeContainer: { backgroundColor: COLORS.greenMuted, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.green },
  tripCode: { color: COLORS.green, fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
});
