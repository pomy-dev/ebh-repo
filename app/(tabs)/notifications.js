import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Icons } from '../../constant/icons';

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <View
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
        >
          <Text style={styles.sectionTitle}>Today</Text>

          <TouchableOpacity style={styles.notificationCard}>
            <View style={[styles.notificationIcon, { backgroundColor: '#EEF2FF' }]}>
              <Icons.MaterialIcons name='payments' size={20} color="#4F46E5" />
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>Rent Payment Reminder</Text>
                <Text style={styles.notificationTime}>2h ago</Text>
              </View>
              <Text style={styles.notificationText}>
                Your rent payment of $1,450 is due in 5 days. Please ensure timely payment to avoid late fees.
              </Text>
              <View style={styles.notificationActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Pay Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                  <Text style={styles.secondaryButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.notificationCard}>
            <View style={[styles.notificationIcon, { backgroundColor: '#F0FDF4' }]}>
              <Icons.AntDesign name='info' size={20} color="#16A34A" />
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>Building Announcement</Text>
                <Text style={styles.notificationTime}>4h ago</Text>
              </View>
              <Text style={styles.notificationText}>
                Water will be shut off tomorrow between 10AM-2PM for scheduled maintenance.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
        >
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Yesterday</Text>

          <TouchableOpacity style={styles.notificationCard}>
            <View style={[styles.notificationIcon, { backgroundColor: '#D1FAE5' }]}>
              <Icons.Feather name='check-circle' size={20} color="#059669" />
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>Maintenance Completed</Text>
                <Text style={styles.notificationTime}>1d ago</Text>
              </View>
              <Text style={styles.notificationText}>
                Your maintenance request #REQ-2023-002 for bathroom light fixture has been marked as completed.
              </Text>
              <View style={styles.notificationActions}>
                <TouchableOpacity style={[styles.actionButton, styles.outlineButton]}>
                  <Text style={styles.outlineButtonText}>Provide Feedback</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.notificationCard}>
            <View style={[styles.notificationIcon, { backgroundColor: '#DBEAFE' }]}>
              <Icons.FontAwesome5 name='clipboard-list' size={20} color="#2563EB" />
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>Maintenance Update</Text>
                <Text style={styles.notificationTime}>1d ago</Text>
              </View>
              <Text style={styles.notificationText}>
                A technician has been assigned to your request #REQ-2023-001 for kitchen faucet leak. Estimated visit: May 19, 9AM-12PM.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Earlier This Week</Text>

          <TouchableOpacity style={styles.notificationCard}>
            <View style={[styles.notificationIcon, { backgroundColor: '#FEF3C7' }]}>
              <Icons.AntDesign name='bells' size={20} color="#D97706" />
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>Community Event</Text>
                <Text style={styles.notificationTime}>3d ago</Text>
              </View>
              <Text style={styles.notificationText}>
                Join us for a resident social gathering this Saturday from 4PM-7PM in the courtyard. Food and refreshments will be provided.
              </Text>
              <View style={styles.notificationActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>RSVP</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                  <Text style={styles.secondaryButtonText}>Not Interested</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
          style={styles.viewMoreContainer}
        >
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View Older Notifications</Text>
            <Icons.Ionicons name='chevron-forward' size={16} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  settingsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  settingsText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  notificationActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 14,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  outlineButtonText: {
    color: '#4F46E5',
    fontWeight: '500',
    fontSize: 14,
  },
  viewMoreContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewMoreText: {
    color: '#4F46E5',
    fontWeight: '500',
    fontSize: 14,
    marginRight: 4,
  },
});

export default NotificationsScreen;