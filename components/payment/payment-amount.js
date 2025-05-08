import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const PaymentAmountSection = ({ amount, onChangeAmount, error, isDark }) => {
  const themeStyles = {
    textColor: isDark ? '#f9fafb' : '#111827',
    placeholderColor: isDark ? '#4b5563' : '#9ca3af',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    inputBackground: isDark ? '#1f2937' : '#ffffff',
    errorColor: '#ef4444',
  };

  const handleAmountChange = (text) => {
    // Only allow numbers and decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    onChangeAmount(cleanText);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
        Payment Amount
      </Text>
      
      <View style={styles.amountContainer}>
        <View style={styles.dollarSignContainer}>
          <Text style={[styles.dollarSign, { color: themeStyles.textColor }]}>$</Text>
        </View>
        <TextInput
          style={[
            styles.amountInput,
            { 
              color: themeStyles.textColor,
              borderColor: error ? themeStyles.errorColor : themeStyles.borderColor,
              backgroundColor: themeStyles.inputBackground
            }
          ]}
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={themeStyles.placeholderColor}
        />
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: themeStyles.errorColor }]}>
          {error}
        </Text>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          This is your monthly rent payment
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dollarSignContainer: {
    marginRight: 8,
    justifyContent: 'center',
  },
  dollarSign: {
    fontSize: 30,
    fontWeight: '600',
  },
  amountInput: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 30,
    paddingHorizontal: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
  },
});

export default PaymentAmountSection;