import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import CardDetailsSection from './payment/card-details';
import PropertyDetailsSection from './payment/property-details';
import PaymentAmountSection from './payment/payment-amount';
import PaymentDateSection from './payment/payment-date';
import { formatCardNumber } from '../utils/formatters';

const PaymentForm = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === 'dark';

  const themeStyles = {
    backgroundColor: isDark ? '#111827' : '#f9fafb',
    textColor: isDark ? '#f9fafb' : '#111827',
    cardBackground: isDark ? '#1f2937' : '#ffffff',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    secondaryText: isDark ? '#9ca3af' : '#6b7280',
  };

  const [activeSection, setActiveSection] = useState('amount');
  const [formData, setFormData] = useState({
    amount: '1450.00',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    apartment: 'Apt #304',
    address: '123 Main Street',
    landlordName: 'Parkview Properties',
    landlordEmail: 'management@parkview.com',
    paymentDate: new Date(),
  });

  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateSection = (section) => {
    let newErrors = {};
    let isValid = true;

    if (section === 'amount') {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Please enter a valid amount';
        isValid = false;
      }
    }

    if (section === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        isValid = false;
      }

      if (!formData.cardName) {
        newErrors.cardName = 'Please enter the name on card';
        isValid = false;
      }

      if (!formData.expiryDate || !formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        isValid = false;
      }

      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid security code';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = (current) => {
    if (validateSection(current)) {
      if (current === 'amount') setActiveSection('property');
      else if (current === 'property') setActiveSection('date');
      else if (current === 'date') setActiveSection('card');
    }
  };

  const handleBack = (current) => {
    if (current === 'card') setActiveSection('date');
    else if (current === 'date') setActiveSection('property');
    else if (current === 'property') setActiveSection('amount');
  };

  const handleSubmit = () => {
    if (validateSection('card')) {
      Alert.alert(
        "Payment Confirmation",
        `Process payment of $${formData.amount} to ${formData.landlordName}?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Pay Now",
            onPress: () => {
              // Simulate payment processing
              setTimeout(() => {
                Alert.alert(
                  "Payment Successful",
                  `Your payment of $${formData.amount} has been processed successfully.`,
                  [{
                    text: "OK",
                    onPress: () => router.push('/history')
                  }]
                );
              }, 1500);
            }
          }
        ]
      );
    }
  };

  const renderSectionIndicator = (section, label) => {
    const isActive = activeSection === section;
    const isPast =
      (section === 'amount' && ['property', 'date', 'card'].includes(activeSection)) ||
      (section === 'property' && ['date', 'card'].includes(activeSection)) ||
      (section === 'date' && activeSection === 'card');

    return (
      <View style={styles.sectionIndicator}>
        <View style={[
          styles.sectionCircle,
          isActive && { backgroundColor: isDark ? '#3b82f6' : '#0071ff', borderColor: isDark ? '#3b82f6' : '#0071ff' },
          isPast && { backgroundColor: '#10b981', borderColor: '#10b981' }
        ]}>
          {isPast ? (
            <Check size={16} color='#ffffff' />
          ) : (
            <Text style={[
              styles.sectionNumber,
              (isActive || isPast) && { color: '#ffffff' }
            ]}>
              {section === 'amount' ? '1' : section === 'property' ? '2' : section === 'date' ? '3' : '4'}
            </Text>
          )}
        </View>
        <Text style={[
          styles.sectionLabel,
          isActive && { color: isDark ? '#60a5fa' : '#0071ff', fontWeight: '600' },
          isPast && { color: '#10b981' }
        ]}>
          {label}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeStyles.textColor }]}>Make a Payment</Text>
        <Text style={[styles.subtitle, { color: themeStyles.secondaryText }]}>
          Complete the form to pay your rent
        </Text>
      </View>

      <View style={styles.progressTracker}>
        {renderSectionIndicator('amount', 'Amount')}
        <View style={[styles.progressLine, ['property', 'date', 'card'].includes(activeSection) && { backgroundColor: '#10b981' }]} />
        {renderSectionIndicator('property', 'Property')}
        <View style={[styles.progressLine, ['date', 'card'].includes(activeSection) && { backgroundColor: '#10b981' }]} />
        {renderSectionIndicator('date', 'Date')}
        <View style={[styles.progressLine, activeSection === 'card' && { backgroundColor: '#10b981' }]} />
        {renderSectionIndicator('card', 'Payment')}
      </View>

      <View style={[styles.formContainer, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
        {activeSection === 'amount' && (
          <PaymentAmountSection
            amount={formData.amount}
            onChangeAmount={(val) => updateFormData('amount', val)}
            error={errors.amount}
            isDark={isDark}
          />
        )}

        {activeSection === 'property' && (
          <PropertyDetailsSection
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            isDark={isDark}
          />
        )}

        {activeSection === 'date' && (
          <PaymentDateSection
            paymentDate={formData.paymentDate}
            onChange={(date) => updateFormData('paymentDate', date)}
            isDark={isDark}
          />
        )}

        {activeSection === 'card' && (
          <CardDetailsSection
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            isDark={isDark}
          />
        )}

        <View style={styles.buttonRow}>
          {activeSection !== 'amount' && (
            <TouchableOpacity
              style={[styles.button, styles.backButton, { borderColor: themeStyles.borderColor }]}
              onPress={() => handleBack(activeSection)}
            >
              <Text style={[styles.backButtonText, { color: themeStyles.textColor }]}>Back</Text>
            </TouchableOpacity>
          )}

          {activeSection !== 'card' ? (
            <TouchableOpacity
              style={[styles.button, styles.nextButton, { backgroundColor: isDark ? '#3b82f6' : '#0071ff' }]}
              onPress={() => handleNext(activeSection)}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.submitButton, { backgroundColor: '#00c853' }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Pay ${formData.amount}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {activeSection === 'card' && (
        <View style={styles.secureInfo}>
          <Text style={[styles.secureText, { color: themeStyles.secondaryText }]}>
            Your payment information is secure and encrypted
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
  },
  progressTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  sectionIndicator: {
    alignItems: 'center',
    width: 60,
  },
  sectionCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  sectionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  sectionLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#9ca3af',
    marginHorizontal: 4,
  },
  formContainer: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    borderWidth: 1,
    flex: 0.48,
  },
  nextButton: {
    flex: activeSection === 'amount' ? 1 : 0.48,
  },
  submitButton: {
    flex: 0.48,
  },
  backButtonText: {
    fontWeight: '600',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  secureInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  secureText: {
    fontSize: 12,
  },
});

export default PaymentForm;