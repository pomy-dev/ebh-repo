import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const Policy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.paragraph}>
        Your privacy is important to us. This privacy statement explains the personal data our app processes, how we process it, and for what purposes.
      </Text>
      <Text style={styles.subTitle}>Information We Collect</Text>
      <Text style={styles.paragraph}>
        We may collect the following types of information:
        {'\n'}- Personal Information: Name, email address, and other identifiable information.
        {'\n'}- Usage Data: Information about how you use our app.
      </Text>
      <Text style={styles.subTitle}>How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        We use the information we collect for various purposes, including:
        {'\n'}- To provide and maintain our app.
        {'\n'}- To notify you about changes to our app.
        {'\n'}- To allow you to participate in interactive features.
      </Text>
      <Text style={styles.subTitle}>Security of Your Information</Text>
      <Text style={styles.paragraph}>
        We take the security of your personal information seriously. We use reasonable administrative, technical, and physical measures to protect your information.
      </Text>
      <Text style={styles.subTitle}>Changes to This Privacy Policy</Text>
      <Text style={styles.paragraph}>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy in this app.
      </Text>
      <Text style={styles.paragraph}>
        If you have any questions about this Privacy Policy, please contact us.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
});

export default Policy;