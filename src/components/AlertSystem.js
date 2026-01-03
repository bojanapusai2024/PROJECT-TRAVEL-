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

    const getTypeStyles = () => {
        switch (alert.type) {
            case 'success':
                return {
                    bg: '#10B98120',
                    border: '#10B98140',
                    text: '#10B981',
                    icon: 'location', // Or a checkmark if available
                };
            case 'error':
                return {
                    bg: '#EF444420',
                    border: '#EF444440',
                    text: '#EF4444',
                    icon: 'close',
                };
            default:
                return {
                    bg: colors.cardLight,
                    border: colors.primaryBorder,
                    text: colors.text,
                    icon: 'message',
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <Animated.View
            style={[
                styles.alertContainer,
                {
                    transform: [{ translateY: anim }],
                    backgroundColor: typeStyles.bg,
                    borderColor: typeStyles.border,
                },
            ]}
        >
            <View style={styles.alertContent}>
                <View style={[styles.iconContainer, { backgroundColor: typeStyles.text + '20' }]}>
                    <Icon name={typeStyles.icon} size={16} color={typeStyles.text} />
                </View>
                <Text style={[styles.alertText, { color: typeStyles.text }]}>{alert.message}</Text>
            </View>
            <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
                <View style={styles.closeIconBg}>
                    <Text style={{ color: typeStyles.text, fontSize: 12, fontWeight: 'bold' }}>✕</Text>
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
        width: Math.min(width - 32, 400),
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
        }),
    },
    alertContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    alertText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
    closeIconBg: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
