import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobileDetectionService } from '../services/detectionService';
import { notificationService } from '../services/notificationService';

export default function SettingsScreen() {
    const [settings, setSettings] = useState({
        notifications: true,
        locationTracking: true,
        offlineMode: false,
        autoSpray: false,
        soundEnabled: true,
        vibrationEnabled: true,
    });
    const [detectionCapabilities, setDetectionCapabilities] = useState({
        geminiAvailable: false,
        mlModelLoaded: false,
        isOnline: true,
    });

    useEffect(() => {
        loadSettings();
        checkCapabilities();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('app_settings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async (newSettings: any) => {
        try {
            await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const checkCapabilities = async () => {
        const capabilities = await mobileDetectionService.getDetectionCapabilities();
        setDetectionCapabilities(capabilities);
    };

    const handleSettingChange = (key: string, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache',
            'This will clear all cached data and ML models. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Alert.alert('Success', 'Cache cleared successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear cache');
                        }
                    }
                }
            ]
        );
    };

    const handleTestNotification = () => {
        notificationService.sendLocalNotification({
            title: 'Test Notification',
            body: 'This is a test notification from Ann Rakshak',
        });
    };

    const SettingItem = ({
        title,
        subtitle,
        icon,
        value,
        onValueChange,
        type = 'switch'
    }: any) => (
        <View style={styles.settingItem}>
            <View style={styles.settingContent}>
                <Ionicons name={icon} size={24} color="#10b981" />
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                    thumbColor={value ? '#ffffff' : '#9ca3af'}
                />
            ) : (
                <TouchableOpacity onPress={onValueChange}>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
            )}
        </View>
    );

    const StatusIndicator = ({ label, status, icon }: any) => (
        <View style={styles.statusItem}>
            <Ionicons
                name={icon}
                size={20}
                color={status ? '#10b981' : '#ef4444'}
            />
            <Text style={styles.statusLabel}>{label}</Text>
            <View style={[
                styles.statusDot,
                { backgroundColor: status ? '#10b981' : '#ef4444' }
            ]} />
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="settings" size={32} color="#10b981" />
                <Text style={styles.headerTitle}>Settings</Text>
                <Text style={styles.headerSubtitle}>Configure your app preferences</Text>
            </View>

            {/* System Status */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>System Status</Text>
                <StatusIndicator
                    label="Online Mode"
                    status={detectionCapabilities.isOnline}
                    icon="wifi"
                />
                <StatusIndicator
                    label="ML Model"
                    status={detectionCapabilities.mlModelLoaded}
                    icon="brain"
                />
                <StatusIndicator
                    label="Gemini API"
                    status={detectionCapabilities.geminiAvailable}
                    icon="flash"
                />
            </View>

            {/* Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <SettingItem
                    title="Push Notifications"
                    subtitle="Receive alerts for disease detection and spray events"
                    icon="notifications"
                    value={settings.notifications}
                    onValueChange={(value: boolean) => handleSettingChange('notifications', value)}
                />
                <SettingItem
                    title="Sound"
                    subtitle="Play sound for notifications"
                    icon="volume-high"
                    value={settings.soundEnabled}
                    onValueChange={(value: boolean) => handleSettingChange('soundEnabled', value)}
                />
                <SettingItem
                    title="Vibration"
                    subtitle="Vibrate for notifications"
                    icon="phone-portrait"
                    value={settings.vibrationEnabled}
                    onValueChange={(value: boolean) => handleSettingChange('vibrationEnabled', value)}
                />
                <TouchableOpacity style={styles.actionButton} onPress={handleTestNotification}>
                    <Ionicons name="send" size={20} color="#10b981" />
                    <Text style={styles.actionButtonText}>Test Notification</Text>
                </TouchableOpacity>
            </View>

            {/* Detection Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detection Settings</Text>
                <SettingItem
                    title="Location Tracking"
                    subtitle="Use GPS coordinates for field zone tracking"
                    icon="location"
                    value={settings.locationTracking}
                    onValueChange={(value: boolean) => handleSettingChange('locationTracking', value)}
                />
                <SettingItem
                    title="Offline Mode"
                    subtitle="Use only local ML models (no internet required)"
                    icon="cloud-offline"
                    value={settings.offlineMode}
                    onValueChange={(value: boolean) => handleSettingChange('offlineMode', value)}
                />
                <SettingItem
                    title="Auto Spray"
                    subtitle="Automatically trigger spray when disease is detected"
                    icon="water"
                    value={settings.autoSpray}
                    onValueChange={(value: boolean) => handleSettingChange('autoSpray', value)}
                />
            </View>

            {/* App Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Information</Text>
                <View style={styles.infoItem}>
                    <Ionicons name="information-circle" size={20} color="#6b7280" />
                    <Text style={styles.infoLabel}>Version</Text>
                    <Text style={styles.infoValue}>1.0.0</Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="build" size={20} color="#6b7280" />
                    <Text style={styles.infoLabel}>Build</Text>
                    <Text style={styles.infoValue}>BEAST MODE</Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="code-slash" size={20} color="#6b7280" />
                    <Text style={styles.infoLabel}>Framework</Text>
                    <Text style={styles.infoValue}>React Native + Expo</Text>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions</Text>
                <TouchableOpacity style={styles.actionButton} onPress={handleClearCache}>
                    <Ionicons name="trash" size={20} color="#ef4444" />
                    <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Clear Cache</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={checkCapabilities}>
                    <Ionicons name="refresh" size={20} color="#10b981" />
                    <Text style={styles.actionButtonText}>Refresh Status</Text>
                </TouchableOpacity>
            </View>

            {/* About */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.aboutContainer}>
                    <Text style={styles.aboutText}>
                        Ann Rakshak is an AI-powered pesticide control system that helps farmers
                        detect plant diseases and optimize pesticide usage for sustainable agriculture.
                    </Text>
                    <Text style={styles.aboutText}>
                        Built with cutting-edge technology including Gemini AI, TensorFlow.js,
                        and real-time hardware integration.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: '#10b981',
        padding: 24,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 12,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#d1fae5',
    },
    section: {
        backgroundColor: '#ffffff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    statusLabel: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        marginLeft: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    settingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingText: {
        marginLeft: 12,
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
    settingSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        marginTop: 8,
    },
    actionButtonText: {
        fontSize: 16,
        color: '#10b981',
        fontWeight: '500',
        marginLeft: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
        marginLeft: 12,
    },
    infoValue: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '500',
    },
    aboutContainer: {
        gap: 12,
    },
    aboutText: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
});
