import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'react-query';
import { mobileDetectionService } from '../services/detectionService';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const { data: analytics, refetch } = useQuery(
        'analytics',
        () => mobileDetectionService.getAnalytics(),
        {
            refetchInterval: 30000,
        }
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const StatCard = ({ title, value, icon, color, subtitle }: any) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={styles.statHeader}>
                <Ionicons name={icon} size={24} color={color} />
                <Text style={styles.statTitle}>{title}</Text>
            </View>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
    );

    const ProgressBar = ({ label, value, color, max = 100 }: any) => (
        <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{label}</Text>
                <Text style={styles.progressValue}>{value}%</Text>
            </View>
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${Math.min((value / max) * 100, 100)}%`,
                            backgroundColor: color
                        }
                    ]}
                />
            </View>
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
                <Ionicons name="analytics" size={32} color="#10b981" />
                <Text style={styles.headerTitle}>Analytics Dashboard</Text>
                <Text style={styles.headerSubtitle}>Real-time field monitoring</Text>
            </View>

            {/* Key Metrics */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Metrics</Text>
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Total Detections"
                        value={analytics?.total_detections || 0}
                        icon="eye"
                        color="#3b82f6"
                        subtitle="All time"
                    />
                    <StatCard
                        title="Healthy Plants"
                        value={analytics?.healthy_plants || 0}
                        icon="checkmark-circle"
                        color="#10b981"
                        subtitle="No treatment needed"
                    />
                    <StatCard
                        title="Infected Plants"
                        value={analytics?.infected_plants || 0}
                        icon="warning"
                        color="#ef4444"
                        subtitle="Requires treatment"
                    />
                    <StatCard
                        title="Spray Events"
                        value={analytics?.total_spray_events || 0}
                        icon="water"
                        color="#8b5cf6"
                        subtitle="Treatment applied"
                    />
                </View>
            </View>

            {/* Performance Metrics */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Performance</Text>
                <View style={styles.performanceContainer}>
                    <ProgressBar
                        label="Detection Accuracy"
                        value={Math.round(analytics?.detection_accuracy || 0)}
                        color="#10b981"
                    />
                    <ProgressBar
                        label="Efficiency Score"
                        value={Math.round(analytics?.efficiency_score || 0)}
                        color="#3b82f6"
                    />
                    <ProgressBar
                        label="System Uptime"
                        value={99.9}
                        color="#8b5cf6"
                    />
                </View>
            </View>

            {/* Cost Analysis */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cost Analysis</Text>
                <View style={styles.costContainer}>
                    <View style={styles.costCard}>
                        <Ionicons name="trending-up" size={32} color="#10b981" />
                        <View style={styles.costContent}>
                            <Text style={styles.costAmount}>${analytics?.cost_saved || 0}</Text>
                            <Text style={styles.costLabel}>Saved Today</Text>
                        </View>
                    </View>

                    <View style={styles.costDetails}>
                        <View style={styles.costItem}>
                            <Text style={styles.costItemLabel}>Pesticide Used</Text>
                            <Text style={styles.costItemValue}>{analytics?.pesticide_used_today || 0}L</Text>
                        </View>
                        <View style={styles.costItem}>
                            <Text style={styles.costItemLabel}>Efficiency Gain</Text>
                            <Text style={styles.costItemValue}>3x faster</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Disease Analysis */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Disease Analysis</Text>
                <View style={styles.diseaseContainer}>
                    <View style={styles.diseaseItem}>
                        <Ionicons name="medical" size={20} color="#ef4444" />
                        <View style={styles.diseaseContent}>
                            <Text style={styles.diseaseLabel}>Most Common Disease</Text>
                            <Text style={styles.diseaseValue}>
                                {analytics?.most_common_disease || 'None detected'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.diseaseItem}>
                        <Ionicons name="leaf" size={20} color="#10b981" />
                        <View style={styles.diseaseContent}>
                            <Text style={styles.diseaseLabel}>Most Common Plant</Text>
                            <Text style={styles.diseaseValue}>
                                {analytics?.most_common_plant || 'Unknown'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Health Score */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Field Health Score</Text>
                <View style={styles.healthContainer}>
                    <View style={styles.healthCircle}>
                        <Text style={styles.healthScore}>
                            {Math.round(analytics?.efficiency_score || 0)}
                        </Text>
                        <Text style={styles.healthLabel}>Health Score</Text>
                    </View>
                    <View style={styles.healthDetails}>
                        <Text style={styles.healthDescription}>
                            Your field is performing well with {analytics?.healthy_plants || 0} healthy plants
                            and {analytics?.infected_plants || 0} requiring attention.
                        </Text>
                    </View>
                </View>
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                <View style={styles.recommendationsContainer}>
                    <View style={styles.recommendationItem}>
                        <Ionicons name="bulb" size={20} color="#f59e0b" />
                        <Text style={styles.recommendationText}>
                            Continue regular monitoring for early disease detection
                        </Text>
                    </View>

                    <View style={styles.recommendationItem}>
                        <Ionicons name="shield-checkmark" size={20} color="#10b981" />
                        <Text style={styles.recommendationText}>
                            Maintain current spray schedule for optimal protection
                        </Text>
                    </View>

                    <View style={styles.recommendationItem}>
                        <Ionicons name="trending-up" size={20} color="#3b82f6" />
                        <Text style={styles.recommendationText}>
                            Consider expanding to additional field zones
                        </Text>
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: (width - 64) / 2,
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
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statSubtitle: {
        fontSize: 12,
        color: '#9ca3af',
    },
    performanceContainer: {
        gap: 16,
    },
    progressItem: {
        marginBottom: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    progressValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    costContainer: {
        gap: 16,
    },
    costCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        padding: 16,
        borderRadius: 8,
    },
    costContent: {
        marginLeft: 16,
    },
    costAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#10b981',
    },
    costLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    costDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    costItem: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    costItemLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    costItemValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    diseaseContainer: {
        gap: 12,
    },
    diseaseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
    },
    diseaseContent: {
        marginLeft: 12,
        flex: 1,
    },
    diseaseLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    diseaseValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    healthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    healthCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0fdf4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    healthScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#10b981',
    },
    healthLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    healthDetails: {
        flex: 1,
    },
    healthDescription: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    recommendationsContainer: {
        gap: 12,
    },
    recommendationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
    },
    recommendationText: {
        fontSize: 14,
        color: '#374151',
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
});
