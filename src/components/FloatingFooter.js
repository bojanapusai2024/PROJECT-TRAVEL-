import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  bg: '#000000',
  card: '#0A0A0A',
  green: '#00FF7F',
  greenMuted: 'rgba(0, 255, 127, 0.15)',
  greenBorder: 'rgba(0, 255, 127, 0.3)',
  text: '#FFFFFF',
  textMuted: '#666666',
};

const TABS = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'trip', label: 'Trip', icon: '✈️' },
  { key: 'history', label: 'History', icon: '📜' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

export default function FloatingFooter({ activeTab, onTabPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Text style={styles.icon}>{tab.icon}</Text>
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 18,
  },
  tabActive: {
    backgroundColor: COLORS.greenMuted,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: COLORS.green,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.green,
    fontWeight: '600',
  },
});
