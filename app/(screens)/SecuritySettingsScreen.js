import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const SecuritySettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Security Settings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>2-Factor Authentication:</Text>
        <Text style={styles.value}>Enabled</Text>

        <Text style={styles.label}>Biometric Login:</Text>
        <Text style={styles.value}>Disabled</Text>

        <Text style={styles.label}>Last Password Change:</Text>
        <Text style={styles.value}>May 10, 2025</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
});


export default SecuritySettingsScreen;
