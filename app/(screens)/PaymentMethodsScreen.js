import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

const PaymentMethodsScreen = () => {
  const [expandedMethod, setExpandedMethod] = useState(null);

  const paymentMethods = [
    {
      name: 'Credit Card',
      description: 'Pay securely using your credit card.',
      steps: [
        'Step 1: Enter your credit card number.',
        'Step 2: Provide the expiration date and CVV.',
        'Step 3: Confirm your payment.',
      ],
    },
    {
      name: 'PayPal',
      description: 'Use your PayPal account for quick payments.',
      steps: [
        'Step 1: Log in to your PayPal account.',
        'Step 2: Confirm the payment amount.',
        'Step 3: Complete the transaction.',
      ],
    },
    {
      name: 'Bank Transfer',
      description: 'Transfer directly from your bank account.',
      steps: [
        'Step 1: Use the provided bank details.',
        'Step 2: Enter the amount to transfer.',
        'Step 3: Confirm the transaction.',
      ],
    },
    {
      name: 'Mobile Payment',
      description: 'Pay through mobile wallets like Apple Pay or Google Pay.',
      steps: [
        'Step 1: Open your mobile wallet app.',
        'Step 2: Scan the QR code or enter the amount.',
        'Step 3: Confirm your payment.',
      ],
    },
  ];

  const handlePaymentMethodPress = (methodName) => {
    setExpandedMethod(expandedMethod === methodName ? null : methodName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Payment Methods</Text>

        {paymentMethods.map((method, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.methodItem}
              onPress={() => handlePaymentMethodPress(method.name)}
            >
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
            </TouchableOpacity>

            {expandedMethod === method.name && (
              <View style={styles.stepsContainer}>
                {method.steps.map((step, stepIndex) => (
                  <Text key={stepIndex} style={styles.stepText}>
                    {step}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  methodItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  methodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  methodDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  stepsContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
});

export default PaymentMethodsScreen;
