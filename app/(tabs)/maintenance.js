import React, { useEffect, useState } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Icons } from '../../constant/icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/app-state/auth-context';
import { getMaintenanceRequestsByTenantId } from '../../services/supabase-services'
import { usePaymentContext } from "../../context/app-state/PaymentContext";

const MaintenanceScreen = () => {
  const router = useRouter();
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tenantID } = usePaymentContext();

  if (!authState || authState.authenticated === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!authState.authenticated || !authState.user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>You are not logged in.</Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const tenant_id = authState?.user?.tenant_id;
        const queryRequests = await getMaintenanceRequestsByTenantId(tenantID.id);

        if (queryRequests) {
          setQueries(queryRequests);
        } else {
          setQueries([]);
        }
      } catch (err) {
        setError('Failed to fetch maintenance requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [tenantID?.id]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchQueries = async () => {

        try {
          setLoading(true);
          // const tenant_id = authState?.user?.tenant_id;
   
          const queryRequests = await getMaintenanceRequestsByTenantId(tenantID.id);

          if (queryRequests) {
            setQueries(queryRequests);
          }

        } catch (err) {
          setError('Failed to fetch maintenance requests');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchQueries();
    }, [tenantID?.id])
  );

  // Filter queries based on activeTab and searchQuery
  const filteredQueries = queries.filter(query => {
    const matchesTab = activeTab === 'all' || query.status === activeTab;
    const matchesSearch = !searchQuery ||
      query.case_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      query.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Maintenance Requests</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(screens)/maintenance')}>
          <Icons.MaterialCommunityIcons name='clipboard-plus-outline' size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View
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
        style={styles.tabsContainer}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {['all', 'pending', 'inProgress', 'completed'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('inProgress', 'In Progress')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={styles.centered} />
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : filteredQueries.length > 0 ? (
          filteredQueries.map((query, index) => (
            <TouchableOpacity style={styles.requestCard} key={index}>
              <View style={styles.requestHeader}>
                <Text style={styles.requestId}>#REQ-{index + 1}</Text>
                {renderStatus(query?.status)}
              </View>
              <Text style={styles.requestTitle}>{query?.case_title || 'Untitled'}</Text>
              <Text style={styles.requestDesc}>
                {query?.description || 'No description provided'}
              </Text>
              <View style={styles.requestFooter}>
                <Text style={styles.requestDate}>
                  Submitted: {query?.created_at ? new Date(query.created_at).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.centered}>
            <Text style={styles.errorText}>No maintenance requests found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
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
});

export default MaintenanceScreen; 