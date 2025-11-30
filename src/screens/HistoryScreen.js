import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const pastTrips = [
    { id: 1, name: 'Paris Adventure', destination: 'Paris, France', date: 'Mar 2024', days: 7, spent: 2500 },
    { id: 2, name: 'Tokyo Explorer', destination: 'Tokyo, Japan', date: 'Jan 2024', days: 10, spent: 4200 },
    { id: 3, name: 'Beach Getaway', destination: 'Bali, Indonesia', date: 'Nov 2023', days: 5, spent: 1800 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trip History 📜</Text>
          <Text style={styles.subtitle}>Your past adventures</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>✈️</Text>
            <Text style={styles.statValue}>{pastTrips.length}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={styles.statValue}>{pastTrips.reduce((sum, t) => sum + t.days, 0)}</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={styles.statValue}>${(pastTrips.reduce((sum, t) => sum + t.spent, 0) / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
        </View>

        {/* Past Trips */}
        <Text style={styles.sectionTitle}>Past Trips</Text>
        {pastTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text style={styles.emptyTitle}>No past trips yet</Text>
            <Text style={styles.emptyText}>Complete your first trip to see it here</Text>
          </View>
        ) : (
          pastTrips.map((trip) => (
            <TouchableOpacity key={trip.id} style={styles.tripCard} activeOpacity={0.8}>
              <View style={styles.tripIcon}>
                <Text style={styles.tripEmoji}>🌍</Text>
              </View>
              <View style={styles.tripInfo}>
                <Text style={styles.tripName}>{trip.name}</Text>
                <Text style={styles.tripDestination}>{trip.destination}</Text>
                <View style={styles.tripMeta}>
                  <Text style={styles.tripDate}>📅 {trip.date}</Text>
                  <Text style={styles.tripDays}>• {trip.days} days</Text>
                </View>
              </View>
              <View style={styles.tripSpent}>
                <Text style={styles.tripSpentValue}>${trip.spent}</Text>
                <Text style={styles.tripSpentLabel}>spent</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  header: { paddingTop: 20, marginBottom: 24 },
  title: { color: colors.text, fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.primaryBorder },
  statEmoji: { fontSize: 24, marginBottom: 8 },
  statValue: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  tripCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.primaryBorder },
  tripIcon: { width: 50, height: 50, borderRadius: 14, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  tripEmoji: { fontSize: 24 },
  tripInfo: { flex: 1, marginLeft: 14 },
  tripName: { color: colors.text, fontSize: 16, fontWeight: '600' },
  tripDestination: { color: colors.primary, fontSize: 13, marginTop: 2 },
  tripMeta: { flexDirection: 'row', marginTop: 6 },
  tripDate: { color: colors.textMuted, fontSize: 12 },
  tripDays: { color: colors.textMuted, fontSize: 12, marginLeft: 4 },
  tripSpent: { alignItems: 'flex-end' },
  tripSpentValue: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  tripSpentLabel: { color: colors.textMuted, fontSize: 11 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '600' },
  emptyText: { color: colors.textMuted, fontSize: 14, marginTop: 8 },
});
