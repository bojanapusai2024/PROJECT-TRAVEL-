import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTravelContext } from '../context/TravelContext';

export default function ProfileScreen({ onBack }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, signOut, updateUserProfile } = useAuth();
  const { tripHistory, currency, setCurrency, currencies, clearTrip } = useTravelContext();
  
  const [showEditName, setShowEditName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            clearTrip();
            await signOut();
          }
        }
      ]
    );
  };

  const handleUpdateName = async () => {
    if (newName.trim()) {
      const result = await updateUserProfile({ displayName: newName.trim() });
      if (result.success) {
        Alert.alert('Success', 'Name updated successfully');
        setShowEditName(false);
      } else {
        Alert.alert('Error', result.error);
      }
    }
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.displayName || 'Traveler'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => {
              setNewName(user?.displayName || '');
              setShowEditName(true);
            }}
          >
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tripHistory?.length || 0}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Countries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {/* Theme Toggle */}
          <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#8B5CF620' }]}>
                <Text style={styles.settingIcon}>{isDark ? '🌙' : '☀️'}</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Theme</Text>
                <Text style={styles.settingValue}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          {/* Currency */}
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowCurrencyPicker(true)}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#10B98120' }]}>
                <Text style={styles.settingIcon}>💰</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Currency</Text>
                <Text style={styles.settingValue}>{currency?.code} ({currency?.symbol})</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleSignOut}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#EF444420' }]}>
                <Text style={styles.settingIcon}>🚪</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Sign Out</Text>
                <Text style={styles.settingValue}>Sign out of your account</Text>
              </View>
            </View>
            <Text style={[styles.settingArrow, { color: '#EF4444' }]}>→</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>TripNest v1.0.0</Text>
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal visible={showEditName} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => setShowEditName(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveBtn}
                onPress={handleUpdateName}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Currency Picker Modal */}
      <Modal visible={showCurrencyPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView>
              {currencies?.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyItem,
                    currency?.code === curr.code && styles.currencyItemActive
                  ]}
                  onPress={() => {
                    setCurrency(curr);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text style={styles.currencyFlag}>{curr.flag}</Text>
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyCode}>{curr.code}</Text>
                    <Text style={styles.currencyName}>{curr.name}</Text>
                  </View>
                  <Text style={styles.currencySymbol}>{curr.symbol}</Text>
                  {currency?.code === curr.code && (
                    <Text style={styles.currencyCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.modalCancelBtn}
              onPress={() => setShowCurrencyPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16 
  },
  backButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: colors.card, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  backButtonText: { fontSize: 22, color: colors.text },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  headerRight: { width: 44 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  profileCard: { 
    backgroundColor: colors.card, 
    borderRadius: 24, 
    padding: 24, 
    alignItems: 'center', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: colors.bg },
  verifiedBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: '#10B981', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  verifiedIcon: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  userName: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  editButton: { 
    backgroundColor: colors.primaryMuted, 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 12 
  },
  editButtonText: { color: colors.primary, fontWeight: '600' },

  statsCard: { 
    flexDirection: 'row', 
    backgroundColor: colors.card, 
    borderRadius: 18, 
    padding: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: colors.primaryBorder },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textMuted, marginBottom: 12, marginLeft: 4 },
  
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: colors.card, 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  dangerItem: { borderColor: '#EF444440' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingIcon: { fontSize: 20 },
  settingInfo: { marginLeft: 14 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
  settingValue: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  settingArrow: { fontSize: 18, color: colors.textMuted },

  version: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { 
    backgroundColor: colors.card, 
    borderRadius: 24, 
    padding: 24, 
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 20, textAlign: 'center' },
  modalInput: { 
    backgroundColor: colors.cardLight, 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    marginBottom: 20,
  },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { 
    flex: 1, 
    backgroundColor: colors.cardLight, 
    borderRadius: 12, 
    padding: 14, 
    alignItems: 'center' 
  },
  modalCancelText: { color: colors.text, fontWeight: '600' },
  modalSaveBtn: { 
    flex: 1, 
    backgroundColor: colors.primary, 
    borderRadius: 12, 
    padding: 14, 
    alignItems: 'center' 
  },
  modalSaveText: { color: colors.bg, fontWeight: 'bold' },

  currencyItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.cardLight,
  },
  currencyItemActive: { backgroundColor: colors.primaryMuted, borderWidth: 1, borderColor: colors.primary },
  currencyFlag: { fontSize: 24, marginRight: 12 },
  currencyInfo: { flex: 1 },
  currencyCode: { fontSize: 16, fontWeight: '600', color: colors.text },
  currencyName: { fontSize: 12, color: colors.textMuted },
  currencySymbol: { fontSize: 18, fontWeight: 'bold', color: colors.textMuted, marginRight: 8 },
  currencyCheck: { fontSize: 18, color: colors.primary, fontWeight: 'bold' },
});
