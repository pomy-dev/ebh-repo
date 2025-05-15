import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Icons } from '../../constant/icons';
import { useRouter } from 'expo-router';
const MaintenanceScreen = () => {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
            <Icons.AntDesign name='clockcircleo' size={14} color="#D97706" />
            <Text style={[styles.statusText, { color: '#D97706' }]}>Pending</Text>
          </View>
        );
      case 'inProgress':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#DBEAFE' }]}>
            <Icons.Feather name='alert-triangle' size={14} color="#2563EB" />
            <Text style={[styles.statusText, { color: '#2563EB' }]}>In Progress</Text>
          </View>
        );
      case 'completed':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
            <Icons.Feather name='check-circle' size={14} color="#059669" />
            <Text style={[styles.statusText, { color: '#059669' }]}>Completed</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
            <Icons.MaterialIcons name='highlight-remove' size={14} color="#DC2626" />
            <Text style={[styles.statusText, { color: '#DC2626' }]}>Cancelled</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Maintenance Requests</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => { router.push('/(screens)/maintenance') }}>
          <Icons.MaterialCommunityIcons name='clipboard-plus-outline' size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 100 }}
        style={styles.searchContainer}
      >
        <Icons.EvilIcons name='search' size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search requests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 200 }}
        style={styles.tabsContainer}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'inProgress' && styles.activeTab]}
            onPress={() => setActiveTab('inProgress')}
          >
            <Text style={[styles.tabText, activeTab === 'inProgress' && styles.activeTabText]}>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <TouchableOpacity style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestId}>#REQ-2023-001</Text>
              {renderStatus('inProgress')}
            </View>
            <Text style={styles.requestTitle}>Leaking Kitchen Faucet</Text>
            <Text style={styles.requestDesc}>
              The kitchen sink faucet is continuously dripping water even when turned off completely.
            </Text>
            <View style={styles.requestFooter}>
              <Text style={styles.requestDate}>Submitted: May 15, 2025</Text>
              <Text style={styles.requestPriority}>High Priority</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestId}>#REQ-2023-002</Text>
              {renderStatus('completed')}
            </View>
            <Text style={styles.requestTitle}>Bathroom Light Fixture</Text>
            <Text style={styles.requestDesc}>
              The light fixture in the main bathroom is flickering and sometimes doesn't turn on.
            </Text>
            <View style={styles.requestFooter}>
              <Text style={styles.requestDate}>Submitted: May 10, 2025</Text>
              <Text style={styles.requestPriority}>Medium Priority</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestId}>#REQ-2023-003</Text>
              {renderStatus('pending')}
            </View>
            <Text style={styles.requestTitle}>Air Conditioning Not Working</Text>
            <Text style={styles.requestDesc}>
              The AC unit in the living room is not cooling properly. The fan runs but the air is not cold.
            </Text>
            <View style={styles.requestFooter}>
              <Text style={styles.requestDate}>Submitted: May 18, 2025</Text>
              <Text style={styles.requestPriority}>High Priority</Text>
            </View>
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
  addButton: {
    backgroundColor: '#4F46E5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    margin: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  tabsContainer: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  tabs: {
    paddingHorizontal: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestId: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  requestDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  requestPriority: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
});

export default MaintenanceScreen;