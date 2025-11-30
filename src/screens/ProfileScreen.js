import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const settingsItems = [
    { icon: '🔔', label: 'Notifications', type: 'toggle', value: true },
    { icon: '💱', label: 'Currency', type: 'value', value: 'USD' },
    { icon: '🌐', label: 'Language', type: 'value', value: 'English' },
    { icon: '📤', label: 'Export Data', type: 'action' },
    { icon: '🗑️', label: 'Clear All Data', type: 'action', danger: true },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile 👤</Text>
          <Text style={styles.subtitle}>Settings & Preferences</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧑‍✈️</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Traveler</Text>
            <Text style={styles.profileEmail}>traveler@travelmate.app</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Theme Toggle */}
        <View style={styles.themeCard}>
          <View style={styles.themeInfo}>
            <Text style={styles.themeIcon}>{isDark ? '🌙' : '☀️'}</Text>
            <View>
              <Text style={styles.themeLabel}>Dark Mode</Text>
              <Text style={styles.themeDescription}>
                {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.cardLight, true: colors.primary }}
            thumbColor={colors.text}
          />
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.settingItem, index < settingsItems.length - 1 && styles.settingItemBorder]}
            >
              <Text style={styles.settingIcon}>{item.icon}</Text>
              <Text style={[styles.settingLabel, item.danger && styles.settingLabelDanger]}>
                {item.label}
              </Text>
              {item.type === 'value' && (
                <Text style={styles.settingValue}>{item.value}</Text>
              )}
              {item.type === 'toggle' && (
                <Switch
                  value={item.value}
                  trackColor={{ false: colors.cardLight, true: colors.primary }}
                  thumbColor={colors.text}
                />
              )}
              {item.type === 'action' && (
                <Text style={styles.settingArrow}>→</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>TravelMate</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

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
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: colors.primaryBorder },
  avatar: { width: 60, height: 60, borderRadius: 20, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 30 },
  profileInfo: { flex: 1, marginLeft: 16 },
  profileName: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  profileEmail: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  editButton: { backgroundColor: colors.primaryMuted, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.primaryBorder },
  editButtonText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  themeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: colors.primaryBorder },
  themeInfo: { flexDirection: 'row', alignItems: 'center' },
  themeIcon: { fontSize: 24, marginRight: 14 },
  themeLabel: { color: colors.text, fontSize: 16, fontWeight: '600' },
  themeDescription: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  settingsCard: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.primaryBorder },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.primaryBorder },
  settingIcon: { fontSize: 20, marginRight: 14 },
  settingLabel: { flex: 1, color: colors.text, fontSize: 15 },
  settingLabelDanger: { color: '#EF4444' },
  settingValue: { color: colors.textMuted, fontSize: 14 },
  settingArrow: { color: colors.textMuted, fontSize: 18 },
  appInfo: { alignItems: 'center', marginTop: 40 },
  appName: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
  appVersion: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
});
