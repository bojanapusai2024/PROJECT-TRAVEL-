import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  bg: '#000000',
  card: '#0A0A0A',
  cardLight: '#111111',
  green: '#00FF7F',
  greenMuted: 'rgba(0, 255, 127, 0.1)',
  greenBorder: 'rgba(0, 255, 127, 0.3)',
  text: '#FFFFFF',
  textMuted: '#666666',
};

const MENU_ITEMS = [
  { icon: '👤', label: 'Edit Profile', subtitle: 'Update your details' },
  { icon: '🔔', label: 'Notifications', subtitle: 'Manage alerts' },
  { icon: '💳', label: 'Payment Methods', subtitle: 'Cards & wallets' },
  { icon: '🌍', label: 'Currency', subtitle: 'USD ($)' },
  { icon: '🎨', label: 'Appearance', subtitle: 'Dark mode' },
  { icon: '🔒', label: 'Privacy', subtitle: 'Security settings' },
  { icon: '❓', label: 'Help & Support', subtitle: 'FAQs & contact' },
];

export default function ProfileScreen({ onBack }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.profileName}>Traveler</Text>
          <Text style={styles.profileEmail}>traveler@email.com</Text>
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>3</Text>
              <Text style={styles.profileStatLabel}>Trips</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>5</Text>
              <Text style={styles.profileStatLabel}>Countries</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>20</Text>
              <Text style={styles.profileStatLabel}>Days</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIcon}>
                <Text style={styles.menuEmoji}>{item.icon}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, marginBottom: 20 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.greenBorder },
  backButtonText: { color: COLORS.green, fontSize: 24, fontWeight: 'bold' },
  title: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  profileCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: COLORS.greenBorder, marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 24, backgroundColor: COLORS.greenMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.green, marginBottom: 16 },
  avatarEmoji: { fontSize: 40 },
  profileName: { color: COLORS.text, fontSize: 22, fontWeight: 'bold' },
  profileEmail: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
  profileStats: { flexDirection: 'row', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: COLORS.greenBorder, width: '100%' },
  profileStat: { flex: 1, alignItems: 'center' },
  profileStatValue: { color: COLORS.green, fontSize: 22, fontWeight: 'bold' },
  profileStatLabel: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  profileStatDivider: { width: 1, backgroundColor: COLORS.greenBorder },
  menuSection: { marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.greenBorder },
  menuIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.greenMuted, alignItems: 'center', justifyContent: 'center' },
  menuEmoji: { fontSize: 20 },
  menuContent: { flex: 1, marginLeft: 14 },
  menuLabel: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  menuSubtitle: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  menuArrow: { color: COLORS.green, fontSize: 18 },
  logoutButton: { backgroundColor: 'rgba(255,68,68,0.1)', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,68,68,0.3)' },
  logoutText: { color: '#FF4444', fontSize: 16, fontWeight: '600' },
  version: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center', marginTop: 20 },
});
