import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { formatCardNumber, formatExpiryDate } from '../../utils/formatters';

const CardDetailsSection = ({ formData, updateFormData, errors, isDark }) => {
  const themeStyles = {
    textColor: isDark ? '#f9fafb' : '#111827',
    placeholderColor: isDark ? '#4b5563' : '#9ca3af',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    inputBackground: isDark ? '#1f2937' : '#ffffff',
    errorColor: '#ef4444',
  };

  const handleCardNumberChange = (text) => {
    const formatted = formatCardNumber(text);
    updateFormData('cardNumber', formatted);
  };

  const handleExpiryDateChange = (text) => {
    const formatted = formatExpiryDate(text);
    updateFormData('expiryDate', formatted);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
        Card Details
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: themeStyles.textColor }]}>Card Number</Text>
        <TextInput
          style={[
            styles.input,
            { 
              color: themeStyles.textColor,
              borderColor: errors.cardNumber ? themeStyles.errorColor : themeStyles.borderColor,
              backgroundColor: themeStyles.inputBackground
            }
          ]}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={themeStyles.placeholderColor}
          value={formData.cardNumber}
          onChangeText={handleCardNumberChange}
          keyboardType="numeric"
          maxLength={19} // 16 digits + 3 spaces
        />
        {errors.cardNumber && (
          <Text style={[styles.errorText, { color: themeStyles.errorColor }]}>
            {errors.cardNumber}
          </Text>
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: themeStyles.textColor }]}>Name on Card</Text>
        <TextInput
          style={[
            styles.input,
            { 
              color: themeStyles.textColor,
              borderColor: errors.cardName ? themeStyles.errorColor : themeStyles.borderColor,
              backgroundColor: themeStyles.inputBackground
            }
          ]}
          placeholder="John Smith"
          placeholderTextColor={themeStyles.placeholderColor}
          value={formData.cardName}
          onChangeText={(text) => updateFormData('cardName', text)}
        />
        {errors.cardName && (
          <Text style={[styles.errorText, { color: themeStyles.errorColor }]}>
            {errors.cardName}
          </Text>
        )}
      </View>
      
      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth, { marginRight: 8 }]}>
          <Text style={[styles.label, { color: themeStyles.textColor }]}>Expiry Date</Text>
          <TextInput
            style={[
              styles.input,
              { 
                color: themeStyles.textColor,
                borderColor: errors.expiryDate ? themeStyles.errorColor : themeStyles.borderColor,
                backgroundColor: themeStyles.inputBackground
              }
            ]}
            placeholder="MM/YY"
            placeholderTextColor={themeStyles.placeholderColor}
            value={formData.expiryDate}
            onChangeText={handleExpiryDateChange}
            keyboardType="numeric"
            maxLength={5} // MM/YY
          />
          {errors.expiryDate && (
            <Text style={[styles.errorText, { color: themeStyles.errorColor }]}>
              {errors.expiryDate}
            </Text>
          )}
        </View>
        
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={[styles.label, { color: themeStyles.textColor }]}>Security Code</Text>
          <TextInput
            style={[
              styles.input,
              { 
                color: themeStyles.textColor,
                borderColor: errors.cvv ? themeStyles.errorColor : themeStyles.borderColor,
                backgroundColor: themeStyles.inputBackground
              }
            ]}
            placeholder="123"
            placeholderTextColor={themeStyles.placeholderColor}
            value={formData.cvv}
            onChangeText={(text) => updateFormData('cvv', text)}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          {errors.cvv && (
            <Text style={[styles.errorText, { color: themeStyles.errorColor }]}>
              {errors.cvv}
            </Text>
          )}
        </View>
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
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  halfWidth: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CardDetailsSection;