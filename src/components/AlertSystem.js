import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { useAlert } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';

const { width } = Dimensions.get('window');

const AlertItem = ({ alert, onRemove }) => {
    const { colors } = useTheme();
    const anim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
        }).start();
    }, []);

    const handleDismiss = () => {
        Animated.timing(anim, {
            toValue: -120,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onRemove(alert.id));
    };

    const getSoftStyles = () => {
        switch (alert.type) {
            case 'success':
                return {
                    bg: '#ECFDF5', // Soft Mint
                    border: '#D1FAE5',
                    text: '#065F46',
                    icon: 'location',
                    accent: '#10B981',
                };
            case 'warning':
                return {
                    bg: '#FFFBEB', // Soft Amber
                    border: '#FEF3C7',
                    text: '#92400E',
                    icon: 'settings',
                    accent: '#F59E0B',
                };
            case 'destructive':
                return {
                    bg: '#FEF2F2', // Soft Rose
                    border: '#FEE2E2',
                    text: '#991B1B',
                    icon: 'close',
                    accent: '#EF4444',
                };
            case 'info':
            default:
                return {
                    bg: '#EFF6FF', // Soft Sky
                    border: '#DBEAFE',
                    text: '#1E40AF',
                    icon: 'message',
                    accent: '#3B82F6',
                };
        }
    };

    const soft = getSoftStyles();

    return (
        <Animated.View
            style={[
                styles.alertContainer,
                {
                    transform: [{ translateY: anim }],
                    backgroundColor: soft.bg,
                    borderColor: soft.border,
                },
            ]}
        >
            <View style={[styles.accentBar, { backgroundColor: soft.accent }]} />
            <View style={styles.alertContent}>
                <View style={[styles.iconContainer, { backgroundColor: soft.accent + '15' }]}>
                    <Icon name={soft.icon} size={16} color={soft.accent} />
                </View>
                <Text style={[styles.alertText, { color: soft.text }]}>{alert.message}</Text>
            </View>
            <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
                <View style={styles.closeIconBg}>
                    <Text style={{ color: soft.text, fontSize: 10, opacity: 0.6 }}>✕</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function AlertSystem() {
    const { alerts, removeAlert } = useAlert();

    return (
        <View style={styles.systemContainer} pointerEvents="box-none">
            {alerts.map((alert, index) => (
                <AlertItem
                    key={alert.id}
                    alert={alert}
                    onRemove={removeAlert}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    systemContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
    },
    alertContainer: {
        width: Math.min(width - 48, 400),
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            },
        }),
    },
    accentBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    alertContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingLeft: 4,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    alertText: {
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    closeIconBg: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
