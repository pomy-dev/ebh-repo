import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useRouter } from "expo-router";
import { Icons } from "../../constant/icons";
import { useAuth } from '../../context/app-state/auth-context';
import PropertyCard from "../../components/property-card";
import { getApartmentsWithProperty, fetchApplicationByEmail, deleteApplication } from "../../services/supabase-services";

export default function PropertiesScreen() {
  const router = useRouter();

  const [apartments, setApartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [requests, setRequests] = useState([{}]);
  const [showBanners, setShowBanners] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // Default to 'available'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    // fetch apartments
    const fetchApartments = async () => {
      setLoading(true);
      try {
        const data = await getApartmentsWithProperty();
        setApartments(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    const fetchRequests = async () => {
      if (!authState?.authenticated && !authState?.user) return;
      const user_email = authState?.user?.email

      try {
        const applications = await fetchApplicationByEmail(user_email);
        setRequests(applications);
      } catch (err) {
        setError("Failed to load user apartment requests.");
      }

    };

    fetchRequests();
    fetchApartments();
  }, []);

  const filteredApartments = apartments.filter((apartment) => {
    const matchesSearch =
      apartment.propertyName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      apartment.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apartment.unit?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "available" && apartment.status === "available") ||
      (filterStatus === "occupied" && apartment.status === "occupied") ||
      (filterStatus === "maintenance" && apartment.status === "maintenance");

    return matchesSearch && matchesFilter;
  });

  const handleDeleteApplication = async (id) => {
    setIsDeleting(true);
    try {
      Alert.alert('This action cannot be undone? Are you sure?')
      deleteApplication(id)
    } catch (error) {
      setError(error)
    } finally {
      setIsDeleting(false);
    }
  }

  const { width: screenWidth } = Dimensions.get('window');
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Icons.Ionicons name="arrow-back-outline" size={24} color="#0a0a0a" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Find Your Home</Text>
        </>
        <>
          <TouchableOpacity
            onPress={() => { setShowBanners(!showBanners) }}
            style={{ marginLeft: "auto", padding: 6 }}
            disabled={!requests || requests.length === 0}
          >
            <Icons.Ionicons name="notifications-outline" size={24} color={requests?.length > 0 ? "#08dd4cff" : "#b2b0b0ff"} />
            {requests && requests.length > 0 && (
              <View style={styles.notice}>
                <Text style={{ color: "#FFFFFF" }}>{requests?.length}</Text>
              </View>

            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            style={{ padding: 8 }}
          >
            <Icons.Ionicons name="person-outline" size={24} color="#0a0a0a" />
          </TouchableOpacity>
        </>
      </View>

      {/* show banners of each request that might be after pressing notification button */}
      {showBanners && (
        <View style={{ padding: 10, backgroundColor: "#f3f4f6" }}>
          <Text style={{ fontSize: 10, color: '#a3a4a6ff', fontFamily: "Inter-Regular", }}>My lease requests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {requests?.map((request) => (
              <View
                key={request?.id}
                style={[styles.banner, { width: screenWidth * 0.7 }]}
              >
                <View style={{ marginBottom: 5 }}>
                  <Text style={{ fontFamily: 'Inter-Regular', fontWeight: '700' }}>{request?.property_apartments?.properties?.property_name},{request?.property_apartments?.properties?.property_type}</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Icons.FontAwesome name='home' size={24} color="#73dc83ff" />
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: 15, color: '#a3a4a6ff' }}>{request?.property_apartments?.unit}</Text>
                    </View>
                    <Text style={[styles.bannerTitle, { backgroundColor: request?.aproval_status === 'pending' ? '#cab049ff' : request?.aproval_status === 'rejected' ? '#cf1a14ff' : '#21cd3bff' }]}>
                      {request?.aproval_status === 'pending' ? 'pending' : request?.aproval_status === 'rejected' ? 'rejected' : 'approved'}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Icons.EvilIcons name='location' size={24} color="black" />
                    <Text>{request?.property_apartments?.properties?.city}, {request?.property_apartments?.properties?.street_address}</Text>
                  </View>
                </View>

                {request?.conditions?.map((condition, index) => (
                  <Text style={{ color: '#fff' }} key={index}>
                    {condition}
                  </Text>
                ))}

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-end', marginBottom: 5 }}>
                  {request?.conditions?.length > 0 && (
                    <TouchableOpacity
                      onPress={() => { }}
                      style={styles.accRules}
                    >
                      <Text style={{ color: '#fff', fontSize: 12 }}>View Rules</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={handleDeleteApplication(request?.id)}
                    style={styles.removeBanner}
                  >
                    {isDeleting ? <ActivityIndicator size={5} color='#ffffff' /> : <Text style={{ color: '#fff', fontSize: 12 }}>Cancel</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icons.EvilIcons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties, locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(!showFilter)}
        >
          <Icons.Feather name="filter" size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {showFilter && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter by Status</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterOptions}
          >
            {["all", "available", "occupied", "maintenance"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterOption,
                  filterStatus === status && styles.filterOptionActive,
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filterStatus === status && styles.filterOptionTextActive,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{ marginTop: 50 }}
          />
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Error</Text>
            <Text style={styles.emptyStateText}>{error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {filteredApartments.length}{" "}
                {filteredApartments.length === 1 ? "apartment" : "apartments"}{" "}
                found
              </Text>
            </View>

            {filteredApartments.map((apartment) => (
              <PropertyCard key={apartment.id} apartment={apartment} />
            ))}

            {filteredApartments.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No properties found</Text>
                <Text style={styles.emptyStateText}>
                  Try adjusting your search criteria or filters
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
    marginTop: 7,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
  },
  notice: {
    fontSize: 5,
    fontFamily: "Inter-Regular",
    backgroundColor: "#FF0000",
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 5,
    top: -3,
    left: 17,
  },
  banner: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0de848ff'
  },
  bannerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 5,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  removeBanner: {
    backgroundColor: '#f20808ff',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 50,
    borderWidth: 1
  },
  accRules: {
    backgroundColor: '#1808f2ff',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 50
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E5E7EB",
    gap: 6,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#111827",
  },
  filterButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
    marginBottom: 12,
  },
  filterOptions: {
    paddingHorizontal: 1,
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
  },
  filterOptionActive: {
    backgroundColor: "#2563EB",
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#6B7280",
  },
  filterOptionTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#6B7280",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#111827",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
    textAlign: "center",
  },
});
