import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { DollarSign, CalendarDays, FileText, ChevronRight } from 'lucide-react-native';
import BottomSheetModal from '../../components/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const PaymentsScreen = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const router = useRouter();

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    router.push('./(screens)/startpayments');
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={styles.upcomingCard}
        >
          <Text style={styles.upcomingTitle}>Upcoming Payment</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>E</Text>
            <Text style={styles.amountValue}>1,450</Text>
            <Text style={styles.amountCents}>.00</Text>
          </View>
          <Text style={styles.dueDate}>Due on April 30, 2025</Text>
          <TouchableOpacity style={styles.payButton} onPress={() => setShowSheet(true)}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        <BottomSheetModal visible={showSheet} onClose={() => setShowSheet(false)}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Payment Methods</Text>
          <View style={styles.methodsContainer} >
            <TouchableOpacity style={{ width: '100%' }}
              onPress={() => handleMethodSelect('card')}
            >
              <LinearGradient style={styles.methodCard} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} colors={['#f20707', '#f07b41']}>
                <Image source={require('../../assets/credit-card.png')}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }}
                />
                <Text
                  style={[
                    styles.methodText
                  ]}
                >
                  Credit Card
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={{ width: '100%' }}
              onPress={() => handleMethodSelect('momo')}
            >
              <LinearGradient style={styles.methodCard} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} colors={['#111191', '#bfa904']}>
                <Image source={require('../../assets/momo.jpg')}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }}
                />
                <Text
                  style={[
                    styles.methodText
                  ]}
                >
                  MoMo Pay
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={{ width: '100%' }}
              onPress={() => handleMethodSelect('insta')}
            >
              <LinearGradient style={styles.methodCard} start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} colors={['#4f2f9c', '#f50505']}>
                <Image source={require('../../assets/instacash.png')}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 5 }}
                />
                <Text
                  style={[
                    styles.methodText
                  ]}
                >
                  Insta-Cash
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>

        <View>
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
            <Text style={styles.historyAmount}>E1,450.00</Text>
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
            <Text style={styles.historyAmount}>E1,450.00</Text>
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
            <Text style={styles.historyAmount}>E1,450.00</Text>
          </TouchableOpacity>
        </View>

        <View>
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
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  methodCard: {
    width: '100%',
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 15,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 8,
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
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginTop: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  }
});

export default PaymentsScreen;