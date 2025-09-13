import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SimpleHomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🌱 Ann Rakshak</Text>
                <Text style={styles.headerSubtitle}>AI-Powered Pesticide Control</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.statusContainer}>
                    <Text style={styles.sectionTitle}>System Status</Text>
                    <View style={styles.statusItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        <Text style={styles.statusLabel}>App Running</Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                        <Text style={styles.statusLabel}>ML Service Ready</Text>
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Ionicons name="camera" size={24} color="#ffffff" />
                        <Text style={styles.primaryButtonText}>Detect Disease</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
    content: {
        flex: 1,
        padding: 16,
    },
    statusContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
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
    actionsContainer: {
        backgroundColor: '#ffffff',
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
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
