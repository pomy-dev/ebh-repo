import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CalendarDays, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const PaymentDateSection = ({ paymentDate, onChange, isDark }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const themeStyles = {
    textColor: isDark ? '#f9fafb' : '#111827',
    secondaryText: isDark ? '#9ca3af' : '#6b7280',
    cardBackground: isDark ? '#1f2937' : '#ffffff',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    highlightColor: isDark ? '#60a5fa' : '#0071ff',
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(paymentDate.getHours());
      newDate.setMinutes(paymentDate.getMinutes());
      onChange(newDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedTime) {
      const newDate = new Date(paymentDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      onChange(newDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
        Payment Date & Time
      </Text>

      <View style={styles.dateTimeContainer}>
        <TouchableOpacity
          style={[styles.datePickerButton, { borderColor: themeStyles.borderColor, backgroundColor: themeStyles.cardBackground }]}
          onPress={() => setShowDatePicker(true)}
        >
          <CalendarDays size={24} color={themeStyles.highlightColor} style={styles.icon} />
          <View>
            <Text style={[styles.datePickerLabel, { color: themeStyles.secondaryText }]}>Payment Date</Text>
            <Text style={[styles.datePickerValue, { color: themeStyles.textColor }]}>{formatDate(paymentDate)}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.datePickerButton, { borderColor: themeStyles.borderColor, backgroundColor: themeStyles.cardBackground }]}
          onPress={() => setShowTimePicker(true)}
        >
          <Clock size={24} color={themeStyles.highlightColor} style={styles.icon} />
          <View>
            <Text style={[styles.datePickerLabel, { color: themeStyles.secondaryText }]}>Payment Time</Text>
            <Text style={[styles.datePickerValue, { color: themeStyles.textColor }]}>{formatTime(paymentDate)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: themeStyles.secondaryText }]}>
          This payment will be processed immediately, but the transaction date will be recorded as shown above.
        </Text>
      </View>

      {(showDatePicker || showTimePicker) && Platform.OS === 'ios' && (
        <View style={[styles.pickerContainer, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              setShowDatePicker(false);
              setShowTimePicker(false);
            }}>
              <Text style={[styles.cancelButton, { color: themeStyles.highlightColor }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.pickerTitle, { color: themeStyles.textColor }]}>
              {showDatePicker ? 'Select Date' : 'Select Time'}
            </Text>
            <TouchableOpacity onPress={() => {
              setShowDatePicker(false);
              setShowTimePicker(false);
            }}>
              <Text style={[styles.doneButton, { color: themeStyles.highlightColor }]}>Done</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={paymentDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              themeVariant={isDark ? 'dark' : 'light'}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={paymentDate}
              mode="time"
              display="spinner"
              onChange={handleTimeChange}
              themeVariant={isDark ? 'dark' : 'light'}
            />
          )}
        </View>
      )}

      {/* For Android, we use the default modal picker */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={paymentDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={paymentDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
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
  dateTimeContainer: {
    marginBottom: 20,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 16,
  },
  datePickerLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  datePickerValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
  },
  pickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 16,
  },
  doneButton: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentDateSection;