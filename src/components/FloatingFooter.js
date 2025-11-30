import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function FloatingFooter({ activeTab, onTabPress }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const tabs = [
    { key: 'home', icon: '🏠', label: 'Home' },
    { key: 'trip', icon: '✈️', label: 'My Trip' },
    { key: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.primaryBorder,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabIcon: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.bg,
  },
});
