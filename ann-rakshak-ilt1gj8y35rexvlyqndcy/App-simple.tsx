import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Ann Rakshak</Text>
      <Text style={styles.subtitle}>AI-Powered Pesticide Control System</Text>
      <Text style={styles.status}>✅ App is running successfully!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: '#059669',
    textAlign: 'center',
  },
});
