import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mobileDetectionService } from '../services/detectionService';
import { notificationService } from '../services/notificationService';
import { DetectionResult } from '../services/detectionService';

export default function ResultsScreen({ route, navigation }: any) {
    const { result }: { result: DetectionResult } = route.params;
    const [isSpraying, setIsSpraying] = useState(false);

    const handleRunMotor = async () => {
        if (result.sprayTimeSeconds <= 0) {
            Alert.alert('No Spray Needed', 'This plant is healthy and does not require pesticide treatment.');
            return;
        }

        Alert.alert(
            'Confirm Spray',
            `Run motor for ${result.sprayTimeSeconds} seconds to treat ${result.diseaseType}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setIsSpraying(true);
                        try {
                            const success = await mobileDetectionService.triggerSpray(result.sprayTimeSeconds);

                            if (success) {
                                await notificationService.sendSprayAlert(
                                    result.sprayTimeSeconds,
                                    result.leafType,
                                    result.diseaseType
                                );

                                // Simulate spray completion after the duration
                                setTimeout(async () => {
                                    await notificationService.sendSprayComplete(result.sprayTimeSeconds, true);
                                    setIsSpraying(false);
                                }, result.sprayTimeSeconds * 1000);
                            } else {
                                await notificationService.sendSprayComplete(result.sprayTimeSeconds, false);
                                setIsSpraying(false);
                                Alert.alert('Spray Failed', 'Failed to trigger spray system. Please check connection.');
                            }
                        } catch (error) {
                            console.error('Spray error:', error);
                            setIsSpraying(false);
                            Alert.alert('Error', 'Failed to trigger spray system.');
                        }
                    }
                }
            ]
        );
    };

    const getStatusColor = () => {
        return result.status === 'healthy' ? '#10b981' : '#ef4444';
    };

    const getStatusIcon = () => {
        return result.status === 'healthy' ? 'checkmark-circle' : 'warning';
    };

    const getMethodColor = () => {
        switch (result.method) {
            case 'gemini': return '#8b5cf6';
            case 'ml': return '#3b82f6';
            case 'hybrid': return '#10b981';
            default: return '#6b7280';
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons
                    name={getStatusIcon()}
                    size={48}
                    color={getStatusColor()}
                />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    {result.status === 'healthy' ? 'Plant is Healthy' : 'Disease Detected'}
                </Text>
                <Text style={styles.confidenceText}>
                    Confidence: {Math.round(result.confidence * 100)}%
                </Text>
                <View style={[styles.methodBadge, { backgroundColor: getMethodColor() }]}>
                    <Text style={styles.methodText}>{result.method.toUpperCase()}</Text>
                </View>
            </View>

            {/* Plant Information */}
            <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>Plant Information</Text>

                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <Ionicons name="leaf" size={20} color="#10b981" />
                        <Text style={styles.infoLabel}>Plant Type</Text>
                        <Text style={styles.infoValue}>{result.leafType}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Ionicons name="medical" size={20} color="#ef4444" />
                        <Text style={styles.infoLabel}>Disease</Text>
                        <Text style={styles.infoValue}>
                            {result.diseaseType === 'none' ? 'None' : result.diseaseType}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
                <Text style={styles.sectionTitle}>Analysis</Text>
                <Text style={styles.descriptionText}>{result.description}</Text>
            </View>

            {/* Spray Recommendation */}
            {result.sprayTimeSeconds > 0 && (
                <View style={styles.sprayContainer}>
                    <Text style={styles.sectionTitle}>Treatment Recommendation</Text>
                    <View style={styles.sprayCard}>
                        <Ionicons name="water" size={32} color="#3b82f6" />
                        <View style={styles.sprayContent}>
                            <Text style={styles.sprayTitle}>Recommended Spray Time</Text>
                            <Text style={styles.sprayDuration}>{result.sprayTimeSeconds} seconds</Text>
                            <Text style={styles.sprayDescription}>
                                Apply pesticide for {result.sprayTimeSeconds} seconds to treat {result.diseaseType}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                {result.sprayTimeSeconds > 0 && (
                    <TouchableOpacity
                        style={[styles.sprayButton, isSpraying && styles.sprayButtonDisabled]}
                        onPress={handleRunMotor}
                        disabled={isSpraying}
                    >
                        {isSpraying ? (
                            <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                            <Ionicons name="play" size={24} color="#ffffff" />
                        )}
                        <Text style={styles.sprayButtonText}>
                            {isSpraying ? 'Spraying...' : 'Run Motor'}
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.analyzeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="camera" size={24} color="#10b981" />
                    <Text style={styles.analyzeButtonText}>Analyze Another</Text>
                </TouchableOpacity>
            </View>

            {/* Technical Details */}
            <View style={styles.technicalContainer}>
                <Text style={styles.sectionTitle}>Technical Details</Text>

                <View style={styles.technicalItem}>
                    <Text style={styles.technicalLabel}>Detection Method</Text>
                    <Text style={styles.technicalValue}>{result.method}</Text>
                </View>

                <View style={styles.technicalItem}>
                    <Text style={styles.technicalLabel}>Timestamp</Text>
                    <Text style={styles.technicalValue}>
                        {new Date(result.timestamp).toLocaleString()}
                    </Text>
                </View>

                {result.gpsCoordinates && (
                    <View style={styles.technicalItem}>
                        <Text style={styles.technicalLabel}>GPS Coordinates</Text>
                        <Text style={styles.technicalValue}>
                            {result.gpsCoordinates.latitude.toFixed(4)}, {result.gpsCoordinates.longitude.toFixed(4)}
                        </Text>
                    </View>
                )}
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
        backgroundColor: '#ffffff',
        margin: 16,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 8,
    },
    confidenceText: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 12,
    },
    methodBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    methodText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoContainer: {
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
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 8,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
    },
    descriptionContainer: {
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
    descriptionText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
    },
    sprayContainer: {
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
    sprayCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        padding: 16,
        borderRadius: 8,
    },
    sprayContent: {
        marginLeft: 16,
        flex: 1,
    },
    sprayTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    sprayDuration: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3b82f6',
        marginBottom: 4,
    },
    sprayDescription: {
        fontSize: 14,
        color: '#6b7280',
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
    sprayButton: {
        backgroundColor: '#ef4444',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    sprayButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    sprayButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    analyzeButton: {
        backgroundColor: '#f3f4f6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
    },
    analyzeButtonText: {
        color: '#10b981',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    technicalContainer: {
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
    technicalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    technicalLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    technicalValue: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
    },
});
