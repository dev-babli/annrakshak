import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'react-query';
import { mobileDetectionService } from '../services/detectionService';
import { notificationService } from '../services/notificationService';

interface AnalyticsData {
    total_detections: number;
    healthy_plants: number;
    infected_plants: number;
    total_spray_events: number;
    pesticide_used_today: number;
    cost_saved: number;
    efficiency_score: number;
    most_common_disease: string;
    most_common_plant: string;
    detection_accuracy: number;
}

export default function HomeScreen({ navigation }: any) {
    const [refreshing, setRefreshing] = useState(false);
    const [detectionCapabilities, setDetectionCapabilities] = useState({
        geminiAvailable: false,
        mlModelLoaded: false,
        isOnline: true,
    });

    const { data: analytics, refetch } = useQuery<AnalyticsData>(
        'analytics',
        () => mobileDetectionService.getAnalytics(),
        {
            refetchInterval: 30000, // Refetch every 30 seconds
        }
    );

    useEffect(() => {
        checkCapabilities();
    }, []);

    const checkCapabilities = async () => {
        const capabilities = await mobileDetectionService.getDetectionCapabilities();
        setDetectionCapabilities(capabilities);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        await checkCapabilities();
        setRefreshing(false);
    };

    const handleQuickDetection = () => {
        navigation.navigate('Detection');
    };

    const handleViewAnalytics = () => {
        navigation.navigate('Analytics');
    };

    const StatCard = ({ title, value, icon, color, onPress }: any) => (
        <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
            <View style={styles.statHeader}>
                <Ionicons name={icon} size={24} color={color} />
                <Text style={styles.statTitle}>{title}</Text>
            </View>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
        </TouchableOpacity>
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
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🌱 Ann Rakshak</Text>
                <Text style={styles.headerSubtitle}>AI-Powered Pesticide Control</Text>
            </View>

            {/* Status Indicators */}
            <View style={styles.statusContainer}>
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

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={handleQuickDetection}>
                    <Ionicons name="camera" size={24} color="#ffffff" />
                    <Text style={styles.primaryButtonText}>Detect Disease</Text>
                </TouchableOpacity>

                <View style={styles.secondaryButtons}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleViewAnalytics}>
                        <Ionicons name="analytics" size={20} color="#10b981" />
                        <Text style={styles.secondaryButtonText}>Analytics</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings" size={20} color="#10b981" />
                        <Text style={styles.secondaryButtonText}>Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Statistics */}
            <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Today's Statistics</Text>

                <View style={styles.statsGrid}>
                    <StatCard
                        title="Total Detections"
                        value={analytics?.total_detections || 0}
                        icon="eye"
                        color="#3b82f6"
                        onPress={handleViewAnalytics}
                    />

                    <StatCard
                        title="Healthy Plants"
                        value={analytics?.healthy_plants || 0}
                        icon="checkmark-circle"
                        color="#10b981"
                        onPress={handleViewAnalytics}
                    />

                    <StatCard
                        title="Infected Plants"
                        value={analytics?.infected_plants || 0}
                        icon="warning"
                        color="#ef4444"
                        onPress={handleViewAnalytics}
                    />

                    <StatCard
                        title="Spray Events"
                        value={analytics?.total_spray_events || 0}
                        icon="water"
                        color="#8b5cf6"
                        onPress={handleViewAnalytics}
                    />
                </View>
            </View>

            {/* Performance Metrics */}
            <View style={styles.metricsContainer}>
                <Text style={styles.sectionTitle}>Performance</Text>

                <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Detection Accuracy</Text>
                    <View style={styles.metricBar}>
                        <View
                            style={[
                                styles.metricFill,
                                { width: `${analytics?.detection_accuracy || 0}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.metricValue}>{Math.round(analytics?.detection_accuracy || 0)}%</Text>
                </View>

                <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Efficiency Score</Text>
                    <View style={styles.metricBar}>
                        <View
                            style={[
                                styles.metricFill,
                                { width: `${analytics?.efficiency_score || 0}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.metricValue}>{Math.round(analytics?.efficiency_score || 0)}%</Text>
                </View>
            </View>

            {/* Cost Savings */}
            <View style={styles.savingsContainer}>
                <Text style={styles.sectionTitle}>Cost Savings</Text>
                <View style={styles.savingsCard}>
                    <Ionicons name="trending-up" size={32} color="#10b981" />
                    <View style={styles.savingsContent}>
                        <Text style={styles.savingsAmount}>${analytics?.cost_saved || 0}</Text>
                        <Text style={styles.savingsLabel}>Saved Today</Text>
                    </View>
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
        padding: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#d1fae5',
    },
    statusContainer: {
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
        marginBottom: 12,
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
    actionsContainer: {
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
    primaryButton: {
        backgroundColor: '#10b981',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    secondaryButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    secondaryButtonText: {
        color: '#10b981',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    statsContainer: {
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        backgroundColor: '#f9fafb',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        marginBottom: 12,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statTitle: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    metricsContainer: {
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
    metricItem: {
        marginBottom: 16,
    },
    metricLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    metricBar: {
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        overflow: 'hidden',
    },
    metricFill: {
        height: '100%',
        backgroundColor: '#10b981',
    },
    metricValue: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'right',
        marginTop: 4,
    },
    savingsContainer: {
        backgroundColor: '#ffffff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 32,
    },
    savingsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        padding: 16,
        borderRadius: 8,
    },
    savingsContent: {
        marginLeft: 16,
    },
    savingsAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#10b981',
    },
    savingsLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
});
