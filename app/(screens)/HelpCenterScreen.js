import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

const HelpCenterScreen = () => {
  const [expandedTopic, setExpandedTopic] = useState(null);

  const helpTopics = [
    {
      name: 'How to add a property and Apply for one',
      description: 'Steps to list a new property and apply for rentals.',
      steps: [
        'Step 1: Navigate to the “My Properties” tab on the bottom bar.',
        'Step 2: Tap “Add Property” and fill in all required details (address, rent, photos, description).',
        'Step 3: Review the information, then tap “Save” to publish the listing.',
        'Step 4: To apply for an existing property, go to the Listings page, select a property, and tap “Apply”.',
        'Step 5: Complete the application form and submit. You’ll receive a confirmation email.',
      ],
    },
    {
      name: 'Reset your password',
      description: 'Change your password securely in a few steps.',
      steps: [
        'Step 1: Open the “Security Settings” screen in your profile.',
        'Step 2: Tap “Change Password”.',
        'Step 3: Enter your current password, then your new password twice.',
        'Step 4: Tap “Confirm”. You’ll be logged out of other devices automatically.',
      ],
    },
    {
      name: 'Update rent details',
      description: 'Edit the monthly rent or lease terms for a property you manage.',
      steps: [
        'Step 1: Go to “My Properties” and select the property you wish to edit.',
        'Step 2: Tap the “Edit” icon (✏️) next to “Rent Details”.',
        'Step 3: Enter the new rent amount and any updated lease notes.',
        'Step 4: Tap “Save”. Tenants will be notified of the change if applicable.',
      ],
    },
    {
      name: 'Contact support',
      description: 'Reach out to our support team for help.',
      steps: [
        'Step 1: In the Help Center, tap “Contact Support”.',
        'Step 2: Choose a contact method: Email, Phone, or Live Chat.',
        'Step 3: Provide a short description of your issue and attach screenshots if needed.',
        'Step 4: Submit. Our team typically responds within 24 hours.',
      ],
    },
  ];

  const toggleTopic = (topicName) => {
    setExpandedTopic(expandedTopic === topicName ? null : topicName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Help Center</Text>

        {helpTopics.map((topic, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.topicCard}
              onPress={() => toggleTopic(topic.name)}
            >
              <Text style={styles.topicName}>{topic.name}</Text>
              <Text style={styles.topicDescription}>{topic.description}</Text>
            </TouchableOpacity>

            {expandedTopic === topic.name && (
              <View style={styles.stepsContainer}>
                {topic.steps.map((step, stepIndex) => (
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

const commonCardShadow = {
  elevation: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
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
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...commonCardShadow,
  },
  topicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  topicDescription: {
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

export default HelpCenterScreen;
