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
  Image,
  Switch,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTravelContext } from '../context/TravelContext';

const AVATARS = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧳', '✈️', '🌍', '🏖️', '⛰️', '🗺️'];

export default function ProfileScreen({ onBack }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, signOut, updateUserProfile, resetPassword } = useAuth();
  const { 
    tripHistory, 
    allTrips,
    currency, 
    setCurrency, 
    currencies,
    getTotalExpenses,
    clearTrip,
    expenses,
  } = useTravelContext();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    avatar: '👤',
  });
  const [selectedAvatar, setSelectedAvatar] = useState('👤');

  const styles = useMemo(() => createStyles(colors), [colors]);

  // Calculate stats
  const stats = useMemo(() => {
    const completedTrips = tripHistory?.length || 0;
    const upcomingTrips = allTrips?.length || 0;
    const totalExpensesAmount = expenses?.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0) || 0;
    
    // Get unique destinations
    const destinations = new Set();
    tripHistory?.forEach(t => t.destination && destinations.add(t.destination.split(',')[0]));
    allTrips?.forEach(t => t.destination && destinations.add(t.destination.split(',')[0]));
    
    return {
      completedTrips,
      upcomingTrips,
      totalTrips: completedTrips + upcomingTrips,
      placesVisited: destinations.size,
      totalSpent: totalExpensesAmount,
    };
  }, [tripHistory, allTrips, expenses]);

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
            await clearTrip();
            await signOut();
          }
        }
      ]
    );
  };

  const handleUpdateProfile = async () => {
    if (editForm.displayName.trim()) {
      const result = await updateUserProfile({ 
        displayName: editForm.displayName.trim(),
      });
      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully');
        setShowEditModal(false);
      } else {
        Alert.alert('Error', result.error);
      }
    }
  };

  const handleResetPassword = () => {
    Alert.alert(
      'Reset Password',
      `Send password reset email to ${user?.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: async () => {
            const result = await resetPassword(user?.email);
            if (result.success) {
              Alert.alert('Email Sent', 'Check your email for password reset instructions.');
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Contact Support', 'Please contact support@tripnest.app to delete your account.');
          }
        }
      ]
    );
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  const getMemberSince = () => {
    if (user?.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    }
    return 'Recently';
  };

  const formatAmount = (amount) => {
    return `${currency.symbol}${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            setEditForm({ displayName: user?.displayName || '' });
            setShowEditModal(true);
          }}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => setShowAvatarPicker(true)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{selectedAvatar !== '👤' ? selectedAvatar : getInitials()}</Text>
              </View>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarBadgeText}>✏️</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.displayName || 'Traveler'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>🎖️ Member since {getMemberSince()}</Text>
              </View>
            </View>
          </View>

          {/* Verified Badge */}
          {user?.emailVerified && (
            <View style={styles.verifiedContainer}>
              <Text style={styles.verifiedIcon}>✓</Text>
              <Text style={styles.verifiedText}>Email Verified</Text>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#3B82F620' }]}>
              <Text style={styles.statIcon}>✈️</Text>
            </View>
            <Text style={styles.statValue}>{stats.totalTrips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#10B98120' }]}>
              <Text style={styles.statIcon}>📍</Text>
            </View>
            <Text style={styles.statValue}>{stats.placesVisited}</Text>
            <Text style={styles.statLabel}>Places</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: '#F59E0B20' }]}>
              <Text style={styles.statIcon}>💰</Text>
            </View>
            <Text style={styles.statValue}>{formatAmount(stats.totalSpent)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#EC489920' }]}>
                <Text style={styles.quickActionEmoji}>❤️</Text>
              </View>
              <Text style={styles.quickActionText}>Saved</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF620' }]}>
                <Text style={styles.quickActionEmoji}>📊</Text>
              </View>
              <Text style={styles.quickActionText}>Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#06B6D420' }]}>
                <Text style={styles.quickActionEmoji}>🏆</Text>
              </View>
              <Text style={styles.quickActionText}>Badges</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#10B98120' }]}>
                <Text style={styles.quickActionEmoji}>📸</Text>
              </View>
              <Text style={styles.quickActionText}>Memories</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {/* Theme Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#8B5CF620' }]}>
                <Text style={styles.settingIcon}>{isDark ? '🌙' : '☀️'}</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingValue}>
                  {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.cardLight, true: colors.primary + '60' }}
              thumbColor={isDark ? colors.primary : colors.textMuted}
            />
          </View>

          {/* Currency */}
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowCurrencyPicker(true)}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#10B98120' }]}>
                <Text style={styles.settingIcon}>{currency.flag}</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Currency</Text>
                <Text style={styles.settingValue}>{currency.name} ({currency.symbol})</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          {/* Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#F59E0B20' }]}>
                <Text style={styles.settingIcon}>🔔</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingValue}>Trip reminders & updates</Text>
              </View>
            </View>
            <Switch
              value={true}
              trackColor={{ false: colors.cardLight, true: colors.primary + '60' }}
              thumbColor={colors.primary}
            />
          </View>
        </View>

        {/* Account & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Security</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleResetPassword}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#3B82F620' }]}>
                <Text style={styles.settingIcon}>🔑</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingValue}>Reset via email</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#6B728020' }]}>
                <Text style={styles.settingIcon}>📋</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Export Data</Text>
                <Text style={styles.settingValue}>Download your trip data</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#6B728020' }]}>
                <Text style={styles.settingIcon}>🔒</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
                <Text style={styles.settingValue}>How we handle your data</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#06B6D420' }]}>
                <Text style={styles.settingIcon}>💬</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Help & Support</Text>
                <Text style={styles.settingValue}>FAQs and contact us</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#EC489920' }]}>
                <Text style={styles.settingIcon}>⭐</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Rate TripNest</Text>
                <Text style={styles.settingValue}>Love the app? Leave a review!</Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]} 
            onPress={handleSignOut}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#EF444420' }]}>
                <Text style={styles.settingIcon}>🚪</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Sign Out</Text>
                <Text style={styles.settingValue}>Sign out of your account</Text>
              </View>
            </View>
            <Text style={[styles.settingArrow, { color: '#EF4444' }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]} 
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBg, { backgroundColor: '#EF444420' }]}>
                <Text style={styles.settingIcon}>🗑️</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Delete Account</Text>
                <Text style={styles.settingValue}>Permanently remove your account</Text>
              </View>
            </View>
            <Text style={[styles.settingArrow, { color: '#EF4444' }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.appLogo}>✈️ TripNest</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>Made with ❤️ for travelers</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.modalInput}
                value={editForm.displayName}
                onChangeText={(text) => setEditForm({ ...editForm, displayName: text })}
                placeholder="Enter your name"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Email</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>{user?.email}</Text>
                <Text style={styles.disabledBadge}>Cannot change</Text>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveBtn}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.modalSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Currency Picker Modal */}
      <Modal visible={showCurrencyPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '70%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.currencyList}>
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
                    <View style={styles.currencyCheck}>
                      <Text style={styles.currencyCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal visible={showAvatarPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Avatar</Text>
              <TouchableOpacity onPress={() => setShowAvatarPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.avatarGrid}>
              {AVATARS.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar && styles.avatarOptionActive
                  ]}
                  onPress={() => {
                    setSelectedAvatar(avatar);
                    setShowAvatarPicker(false);
                  }}
                >
                  <Text style={styles.avatarOptionText}>{avatar}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  
  // Header
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
  editButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    backgroundColor: colors.primaryMuted,
    borderRadius: 10,
  },
  editButtonText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  // Profile Card
  profileCard: { 
    backgroundColor: colors.card, 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: { 
    position: 'relative',
    marginRight: 16,
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 24, 
    backgroundColor: colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: colors.bg },
  avatarBadge: { 
    position: 'absolute', 
    bottom: -4, 
    right: -4, 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor: colors.card, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryBorder,
  },
  avatarBadgeText: { fontSize: 12 },
  profileInfo: {
    flex: 1,
  },
  userName: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: colors.textMuted, marginBottom: 8 },
  memberBadge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  memberBadgeText: { fontSize: 11, color: colors.primary, fontWeight: '500' },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  verifiedIcon: { color: '#10B981', fontSize: 14, fontWeight: 'bold', marginRight: 6 },
  verifiedText: { color: '#10B981', fontSize: 13, fontWeight: '600' },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4 },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionEmoji: { fontSize: 22 },
  quickActionText: { fontSize: 12, color: colors.text, fontWeight: '500' },

  // Sections
  section: { marginBottom: 24 },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.textMuted, 
    marginBottom: 12, 
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Settings Items
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: colors.card, 
    borderRadius: 16, 
    padding: 14, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  dangerItem: { borderColor: '#EF444430' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIconBg: { 
    width: 42, 
    height: 42, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  settingIcon: { fontSize: 18 },
  settingInfo: { marginLeft: 14, flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  settingValue: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  settingArrow: { fontSize: 22, color: colors.textMuted, fontWeight: '300' },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 10,
  },
  appLogo: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  version: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  copyright: { fontSize: 12, color: colors.textLight },

  // Modal Styles
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  modalContent: { 
    backgroundColor: colors.card, 
    borderRadius: 24, 
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryBorder,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  modalClose: { fontSize: 20, color: colors.textMuted, padding: 4 },
  modalBody: { padding: 20 },
  modalFooter: { 
    flexDirection: 'row', 
    gap: 12, 
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
  },
  
  inputLabel: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: colors.textMuted, 
    marginBottom: 8 
  },
  modalInput: { 
    backgroundColor: colors.cardLight, 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  disabledInput: {
    backgroundColor: colors.cardLight,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  disabledInputText: { fontSize: 16, color: colors.textMuted },
  disabledBadge: { 
    fontSize: 10, 
    color: colors.textLight, 
    backgroundColor: colors.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalCancelBtn: { 
    flex: 1, 
    backgroundColor: colors.cardLight, 
    borderRadius: 12, 
    padding: 14, 
    alignItems: 'center' 
  },
  modalCancelText: { color: colors.text, fontWeight: '600', fontSize: 15 },
  modalSaveBtn: { 
    flex: 1, 
    backgroundColor: colors.primary, 
    borderRadius: 12, 
    padding: 14, 
    alignItems: 'center' 
  },
  modalSaveText: { color: colors.bg, fontWeight: 'bold', fontSize: 15 },

  // Currency List
  currencyList: { maxHeight: 400 },
  currencyItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.cardLight,
  },
  currencyItemActive: { 
    backgroundColor: colors.primaryMuted, 
    borderWidth: 1, 
    borderColor: colors.primary 
  },
  currencyFlag: { fontSize: 28, marginRight: 14 },
  currencyInfo: { flex: 1 },
  currencyCode: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  currencyName: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  currencySymbol: { fontSize: 18, fontWeight: 'bold', color: colors.textMuted, marginRight: 10 },
  currencyCheck: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  currencyCheckText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  // Avatar Grid
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    justifyContent: 'center',
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  avatarOptionText: { fontSize: 28 },
});
