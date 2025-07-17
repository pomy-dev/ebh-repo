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
import {
  getApartmentsWithProperty,
  fetchApplicationByEmail,
  deleteApplication,
  makeTenant,
  updateUser,
  updateAcceptedApartment,
  deleteTenantApp
} from "../../services/supabase-services";

export default function PropertiesScreen() {
  const router = useRouter();

  const [apartments, setApartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [requests, setRequests] = useState([{}]);
  const [showBanners, setShowBanners] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // Default to 'available'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  const fetchRequests = async () => {
    if (!authState?.authenticated && !authState?.user) return;
    const userId = authState?.user?.id;
    try {
      const applications = await fetchApplicationByEmail(userId);
      setRequests(applications);
    } catch (err) {
      setError("Failed to load user apartment requests.");
    }
  };

  const handleMakeTenant = async (request) => {
    if (!authState?.authenticated && !authState?.user) return;
    const userId = authState?.user?.id;
    setIsAccepting(true)

    try {

      const tenantDetails = {
        user_id: userId,
        apt_id: request?.apartment_id,
        lease_start_date: request?.move_in_date,
        lease_end_date: request?.lease_end_date,
        emergency_name: request?.emergency_name,
        emergency_phone: request?.emergency_contact,
        relationship: request?.emergency_relationship
      }

      const { data, error } = await makeTenant(tenantDetails);

      if (error) {
        setError(tenantError)
        return;
      }

      console.log(data)
      setIsAccepting(false);
      Alert.alert(
        `Welcome Tenant ${authState?.user?.name} 🤗, to ${request?.property_apartments?.properties?.property_name}, ${request?.property_apartments?.properties?.property_type}`,
        `Your Apartment unit is ${request?.property_apartments?.unit}\nAnd your planned move in date is: ${request?.move_in_date}`,
        [{
          text: 'OK',
          onPress: (async () => {
            const updatedUser = await updateUser(data)
            if (updatedUser) {
              const aptUpdated = await updateAcceptedApartment(request?.apartment_id)
              aptUpdated ? router.push('/(tabs)') : setError('Apartment Accepted was not updated as Occupied. Check the owner!');
              await deleteTenantApp(request?.id)
            } else {
              alert('Something went wrong! Could not redirect you to your dashboard')
            }
          }),
          style: 'destructive'
        }],
        { cancelable: true }
      )
    } catch (error) {
      console.log(error)
    } finally {
      setIsAccepting(false);
    }
  }

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
            <Icons.AntDesign name="bells" size={24} color={requests?.length > 0 ? "#08dd4cff" : "#b2b0b0ff"} />
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
                style={[styles.banner, { width: screenWidth * 0.8 }]}
              >
                <View style={{ marginBottom: 5 }}>
                  <Text style={{ fontFamily: 'Inter-Regular', fontWeight: '700' }}>{request?.property_apartments?.properties?.property_name}, {request?.property_apartments?.properties?.property_type}</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Icons.FontAwesome name='home' size={24} color="#1e17f2ff" />
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: 15, color: '#a3a4a6ff' }}>{request?.property_apartments?.unit}</Text>
                    </View>
                    <Text style={[styles.bannerTitle, { backgroundColor: request?.aproval_status === 'pending' ? '#cab049ff' : request?.aproval_status === 'rejected' ? '#cf1a14ff' : '#21cd3bff' }]}>
                      {request?.aproval_status === 'pending' ? 'pending' : request?.aproval_status === 'rejected' ? 'rejected' : request?.conditions?.length > 0 ? 'approved conditionally' : 'approved'}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Icons.EvilIcons name='location' size={24} color="black" />
                    <Text>{request?.property_apartments?.properties?.city}, {request?.property_apartments?.properties?.street_address}</Text>
                  </View>
                </View>

                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 15, color: '#a3a4a6ff', fontWeight: '200' }}>Created at:{new Date(request?.created_at).toLocaleDateString()}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-end', marginBottom: 5 }}>
                  {request?.conditions?.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        showConditions ? setShowConditions(false) : setShowConditions(true);
                      }}
                      style={[styles.btn, { backgroundColor: '#1808f2ff' }]}
                    >
                      <Text style={{ color: '#fff', fontSize: 14 }}>{showConditions ? 'Hide Rules' : 'View Rules'}</Text>
                    </TouchableOpacity>
                  )}
                  {request?.aproval_status === 'approved' && (
                    <TouchableOpacity
                      onPress={() => handleMakeTenant(request)}
                      style={[styles.btn, { backgroundColor: '#16c342ff' }]}
                    >
                      {isAccepting ? <ActivityIndicator size={15} color='#ffffff' /> : <Text style={{ color: '#fff', fontSize: 14 }}>Accept</Text>}
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Delete Lease Apt Request',
                        'This action cannot be undone. Are you sure?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: async () => {
                              setIsDeleting(true);
                              try {
                                await deleteApplication(request?.id);
                                await fetchRequests();
                              } catch (error) {
                                setError(error);
                              } finally {
                                setIsDeleting(false);
                              }
                            }
                          }
                        ],
                        { cancelable: true }
                      );
                    }}
                    style={[styles.btn, { backgroundColor: '#f20808ff' }]}
                  >
                    {isDeleting ? <ActivityIndicator size={15} color='#ffffff' /> : <Text style={{ color: '#fff', fontSize: 14 }}>{request?.aproval_status === 'approved' ? 'Reject' : 'Cancel'}</Text>}
                  </TouchableOpacity>
                </View>

                {showConditions && (
                  <>
                    {request?.conditions?.map((condition, index) => (
                      <View key={index}>
                        <Text style={{ color: '#444343ff' }}>
                          👉🏾{condition}
                        </Text>
                      </View>

                    ))}
                  </>
                )}

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
              <PropertyCard
                key={apartment.id}
                apartment={apartment}
                onApplicationChange={fetchRequests}
              />
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
    borderColor: '#c4c5c5ff'
  },
  bannerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 5,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  btn: {
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
