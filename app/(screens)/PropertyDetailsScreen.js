import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const PropertyDetailsScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [property, setProperty] = useState({
    title: 'Modern Apartment',
    location: 'Downtown City Center',
    rent: '1200',
    description: 'A beautiful 2-bedroom apartment with balcony.',
  });

  const handleChange = (field, value) => {
    setProperty({ ...property, [field]: value });
  };

  const handleSave = () => {
    // Here, save the updated property data to backend
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Property Details</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.readOnly]}
            editable={isEditing}
            value={property.title}
            onChangeText={(text) => handleChange('title', text)}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.readOnly]}
            editable={isEditing}
            value={property.location}
            onChangeText={(text) => handleChange('location', text)}
          />

          <Text style={styles.label}>Rent ($)</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.readOnly]}
            editable={isEditing}
            keyboardType="numeric"
            value={property.rent}
            onChangeText={(text) => handleChange('rent', text)}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, !isEditing && styles.readOnly]}
            editable={isEditing}
            multiline
            value={property.description}
            onChangeText={(text) => handleChange('description', text)}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
        >
          <Text style={styles.buttonText}>{isEditing ? 'Save Changes' : 'Edit Details'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  scroll: { paddingBottom: 40 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  readOnly: {
    backgroundColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PropertyDetailsScreen;
