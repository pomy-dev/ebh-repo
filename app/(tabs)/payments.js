import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { CreditCard, DollarSign, CalendarDays, FileText, ChevronRight } from 'lucide-react-native';

const PaymentsScreen = () => {
  const [activeMethod, setActiveMethod] = useState('card');

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Payments</Text>
      </MotiView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
          style={styles.upcomingCard}
        >
          <Text style={styles.upcomingTitle}>Upcoming Payment</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.amountValue}>1,450</Text>
            <Text style={styles.amountCents}>.00</Text>
          </View>
          <Text style={styles.dueDate}>Due on June 1, 2025</Text>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
        >
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.methodsContainer}>
            <TouchableOpacity
              style={[
                styles.methodCard,
                activeMethod === 'card' && styles.activeMethodCard
              ]}
              onPress={() => setActiveMethod('card')}
            >
              <CreditCard
                size={24}
                color={activeMethod === 'card' ? '#FFFFFF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.methodText,
                  activeMethod === 'card' && styles.activeMethodText
                ]}
              >
                Credit Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodCard,
                activeMethod === 'bank' && styles.activeMethodCard
              ]}
              onPress={() => setActiveMethod('bank')}
            >
              <DollarSign
                size={24}
                color={activeMethod === 'bank' ? '#FFFFFF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.methodText,
                  activeMethod === 'bank' && styles.activeMethodText
                ]}
              >
                Bank Account
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <View style={styles.historyIconContainer}>
                <DollarSign size={20} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.historyTitle}>May 2025 Rent</Text>
                <Text style={styles.historyDate}>May 1, 2025</Text>
              </View>
            </View>
            <Text style={styles.historyAmount}>$1,450.00</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <View style={styles.historyIconContainer}>
                <DollarSign size={20} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.historyTitle}>April 2025 Rent</Text>
                <Text style={styles.historyDate}>April 1, 2025</Text>
              </View>
            </View>
            <Text style={styles.historyAmount}>$1,450.00</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <View style={styles.historyIconContainer}>
                <DollarSign size={20} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.historyTitle}>March 2025 Rent</Text>
                <Text style={styles.historyDate}>March 1, 2025</Text>
              </View>
            </View>
            <Text style={styles.historyAmount}>$1,450.00</Text>
          </TouchableOpacity>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
        >
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionLink}>
            <View style={styles.actionLinkLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                <CalendarDays size={20} color="#2563EB" />
              </View>
              <Text style={styles.actionLinkText}>Set Up Auto-Pay</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionLink}>
            <View style={styles.actionLinkLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
                <FileText size={20} color="#16A34A" />
              </View>
              <Text style={styles.actionLinkText}>View Payment Receipts</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </MotiView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  upcomingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  upcomingTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 56,
  },
  amountCents: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  dueDate: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  payButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  methodCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeMethodCard: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  methodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 8,
  },
  activeMethodText: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  actionLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionLinkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
});

export default PaymentsScreen;