import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const PropertyDetailsSection = ({ formData, updateFormData, errors, isDark }) => {
  const themeStyles = {
    textColor: isDark ? '#f9fafb' : '#111827',
    placeholderColor: isDark ? '#4b5563' : '#9ca3af',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    inputBackground: isDark ? '#1f2937' : '#ffffff',
    errorColor: '#ef4444',
    sectionBorderColor: isDark ? '#374151' : '#e5e7eb',
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
          Property Details
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeStyles.textColor }]}>Apartment/Unit Number</Text>
          <TextInput
            style={[
              styles.input,
              { 
                color: themeStyles.textColor,
                borderColor: errors.apartment ? themeStyles.errorColor : themeStyles.borderColor,
                backgroundColor: themeStyles.inputBackground
              }
            ]}
            placeholder="Apt #123"
            placeholderTextColor={themeStyles.placeholderColor}
            value={formData.apartment}
            onChangeText={(text) => updateFormData('apartment', text)}
          />
          {errors.apartment && (
            <Text style={[styles.errorText, { color: themeStyles.errorColor }]}>
              {errors.apartment}
            </Text>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeStyles.textColor }]}>Property Address</Text>
          <TextInput
            style={[
              styles.input,
              { 
                color: themeStyles.textColor,
                borderColor: errors.address ? themeStyles.errorColor : themeStyles.borderColor,
                backgroundColor: themeStyles.inputBackground
              }
            ]}
            placeholder="123 Main Street"
            placeholderTextColor={themeStyles.placeholderColor}
            value={formData.address}
            onChangeText={(text) => updateFormData('address', text)}
          />
          {errors.address && (
            <Text style={[styles.errorText, { color: themeStyles.errorColor }]}>
              {errors.address}
            </Text>
          )}
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: themeStyles.sectionBorderColor }]} />
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
          Landlord Information
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeStyles.textColor }]}>Landlord/Property Manager</Text>
          <TextInput
            style={[
              styles.input,
              { 
                color: themeStyles.textColor,
                borderColor: errors.landlordName ? themeStyles.errorColor : themeStyles.borderColor,
                backgroundColor: themeStyles.inputBackground
              }
            ]}
            placeholder="Property Management Company"
            placeholderTextColor={themeStyles.placeholderColor}
            value={formData.landlordName}
            onChangeText={(text) => updateFormData('landlordName', text)}
          />
          {errors.landlordName && (
            <Text style={[styles.errorText, { color: themeStyles.errorColor }]}>
              {errors.landlordName}
            </Text>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: themeStyles.textColor }]}>Contact Email</Text>
          <TextInput
            style={[
              styles.input,
              { 
                color: themeStyles.textColor,
                borderColor: errors.landlordEmail ? themeStyles.errorColor : themeStyles.borderColor,
                backgroundColor: themeStyles.inputBackground
              }
            ]}
            placeholder="manager@property.com"
            placeholderTextColor={themeStyles.placeholderColor}
            value={formData.landlordEmail}
            onChangeText={(text) => updateFormData('landlordEmail', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.landlordEmail && (
            <Text style={[styles.errorText, { color: themeStyles.errorColor }]}>
              {errors.landlordEmail}
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
  section: {
    marginBottom: 16,
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  }
});

export default PropertyDetailsSection;