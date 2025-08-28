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
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useRouter } from "expo-router";
import { Icons } from "../../constant/icons";
import { useAuth } from "../../context/app-state/auth-context";
import PropertyCard from "../../components/property-card";
import {
  getApartmentsWithProperty,
  fetchApplicationByEmail,
  deleteApplication,
  makeTenant,
  updateUser,
  updateAcceptedApartment,
  deleteTenantApp,
} from "../../services/supabase-services";

export default function PropertiesScreen() {
  const router = useRouter();

  const [apartments, setApartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showBanners, setShowBanners] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // Default to 'available'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showRequestsPage, setShowRequestsPage] = useState(false);
  const [RequestsId, setRequestsId] = useState(false);

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
    setIsAccepting(true);

    try {
      const tenantDetails = {
        user_id: userId,
        apt_id: request?.apartment_id,
        lease_start_date: request?.move_in_date,
        lease_end_date: request?.lease_end_date,
        emergency_name: request?.emergency_name,
        emergency_phone: request?.emergency_contact,
        relationship: request?.emergency_relationship,
      };

      const { data, error } = await makeTenant(tenantDetails);

      if (error) {
        setError(tenantError);
        return;
      }

      console.log(data);
      setIsAccepting(false);
      Alert.alert(
        `Welcome Tenant ${authState?.user?.name} 🤗, to ${request?.property_apartments?.properties?.property_name}, ${request?.property_apartments?.properties?.property_type}`,
        `Your Apartment unit is ${request?.property_apartments?.unit}\nAnd your planned move in date is: ${request?.move_in_date}`,
        [
          {
            text: "OK",
            onPress: async () => {
              const updatedUser = await updateUser(data);
              if (updatedUser) {
                const aptUpdated = await updateAcceptedApartment(
                  request?.apartment_id
                );
                aptUpdated
                  ? router.push("/(tabs)")
                  : setError(
                      "Apartment Accepted was not updated as Occupied. Check the owner!"
                    );
                await deleteTenantApp(request?.id);
              } else {
                alert(
                  "Something went wrong! Could not redirect you to your dashboard"
                );
              }
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsAccepting(false);
    }
  };

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

  const { width: screenWidth } = Dimensions.get("window");
  if (!fontsLoaded) return null;

  const handleCancelRequest = async (requestId) => {
    setModalVisible(true);
    setRequestsId(requestId);
  };

  if (showRequestsPage) {
    return (
      <SafeAreaView style={styles.fullScreenContainer}>
        <View  style={styles.header2}>
          <TouchableOpacity
            onPress={() => setShowRequestsPage(false)}
            style={styles.backButton}
          >
            <Icons.Ionicons
              name="arrow-back-outline"
              size={24}
              color="#0a0a0a"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowRequestsPage(false)}
            style={styles.backButton}
          >
           <Text style={styles.resultsText}>{'       '}</Text>
          </TouchableOpacity>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>My Lease Requests</Text>
          </View>
        </View>
        <ScrollView style={styles.scrollView}>
          {requests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No Requests Yet</Text>
              <Text style={styles.emptyStateText}>
                You have cleared all requests. Browse properties and apply.
              </Text>
            </View>
          ) : (
            requests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                {/* Header */}
                <View style={styles.requestHeader}>
                  <Text style={styles.requestProperty}>
                    {request.property_apartments.properties.property_name},{" "}
                    {request.property_apartments.properties.property_type}
                  </Text>
                  <Text
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          request.aproval_status === "pending"
                            ? "#cab049ff"
                            : request.aproval_status === "rejected"
                            ? "#cf1a14ff"
                            : "#21cd3bff",
                      },
                    ]}
                  >
                    {request.aproval_status}
                  </Text>
                </View>

                {/* Unit + Location */}
                <View style={styles.requestDetails}>
                  <View style={styles.detailsRow}>
                    <Icons.FontAwesome
                      name="home"
                      size={20}
                      color="#1e17f2ff"
                    />
                    <Text style={styles.detailText}>
                      Unit {request.property_apartments.unit}
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Icons.EvilIcons name="location" size={22} color="#444" />
                    <Text style={styles.detailText}>
                      {request.property_apartments.properties.city},{" "}
                      {request.property_apartments.properties.street_address}
                    </Text>
                  </View>
                </View>

                {/* Footer */}
                <Text style={styles.createdAt}>
                  Created: {new Date(request.created_at).toLocaleDateString()}
                </Text>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  {request.aproval_status === "approved" && (
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        { backgroundColor: "#16c342ff" },
                      ]}
                      onPress={() => handleMakeTenant(request)}
                    >
                      <Text style={styles.actionText}>Accept</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#f20808ff" }]}
                    onPress={() => {
                      handleCancelRequest(request.id);
                    }}
                  >
                    <Text style={styles.actionText}>
                      {request.approval_status === "approved"
                        ? "Reject"
                        : "Cancel"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
        {/* Modal for dismissing notification */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are you sure you want to cencel request?
              </Text>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#2563EB",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={async () => {
                    if (RequestsId) {
                      await deleteApplication(RequestsId);
                      fetchRequests();
                      setModalVisible(false);
                    }
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>Delete Request</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#2563EB",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icons.Ionicons name="arrow-back-outline" size={24} color="#0a0a0a" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerText}>Find Your Home</Text>
        </View>

        <View style={styles.rightButtonsContainer}>
          <TouchableOpacity
            onPress={() => setShowRequestsPage(true)}
            style={{ padding: 6 }}
            disabled={!requests || requests.length === 0}
          >
            <Icons.FontAwesome
              name="bell"
              size={24}
              color={requests?.length > 0 ? "#0a0a0a" : "#b2b0b0ff"}
            />
            {requests && requests.length > 0 && (
              <View style={styles.notice}>
                <Text style={{ color: "#FFFFFF" }}>{requests?.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => router.push("/(tabs)/profile")}
            style={{ padding: 8 }}
          >
            <Icons.Ionicons name="person-outline" size={24} color="#0a0a0a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* show banners of each request that might be after pressing notification button */}
      {/* {showBanners && (
        <View style={{ padding: 10, backgroundColor: "#f3f4f6" }}>
          <Text
            style={{
              fontSize: 10,
              color: "#a3a4a6ff",
              fontFamily: "Inter-Regular",
            }}
          >
            My lease requests
          </Text>
          // Modal display logic
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>My Lease Requests</Text>
                <ScrollView>
                  {requests.length === 0 ? (
                    <Text>No requests found.</Text>
                  ) : (
                    requests.map((request) => (
                      <View key={request.id} style={styles.modalRequestItem}>
                        <Text style={styles.modalRequestText}>
                          {request.property_apartments.properties.property_name}{" "}
                          - {request.approval_status}
                        </Text>
                        <Text style={styles.modalDate}>
                          {new Date(request.created_at).toLocaleDateString()}
                        </Text>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => {
                            Alert.alert(
                              "Cancel Request",
                              "Are you sure you want to cancel this request?",
                              [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "OK",
                                  onPress: async () => {
                                    await deleteApplication(request.id);
                                    fetchRequests(); // Refresh requests
                                  },
                                },
                              ],
                              { cancelable: true }
                            );
                          }}
                        >
                          <Text style={{ color: "#fff" }}>Cancel Request</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#fff" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )} */}

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
    alignContent: "center",
    paddingRight: 15,
    paddingLeft: 15,
  },
  header2: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    marginBottom: 7,
    marginTop: 7,
    alignContent: "center",
  },
  backButton: {
    padding: 8,
    paddingRight:20,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center", // Center the text horizontally
    justifyContent: "center", // Center the text vertically
  },
  headerText: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
  },
  rightButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
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
    borderColor: "#c4c5c5ff",
  },
  bannerTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 5,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  btn: {
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 50,
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
    paddingLeft:50,
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

  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1, // Ensure this is set
    borderColor: "#000", // Ensure this color is visible against the background
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  requestProperty: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
  },
  statusBadge: {
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  requestDetails: {
    marginBottom: 10,
    gap: 6,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#374151",
  },
  createdAt: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },

  /* Modal Quick View */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    width: "90%", // Wider for better readability
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20, // Increased padding for better spacing
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22, // Slightly larger title for emphasis
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center", // Center align the title
  },
  modalRequestItem: {
    paddingVertical: 12, // Increased padding for better touch target
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    width: "100%", // Ensure full width for items
  },
  modalRequestText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#111827",
  },
  modalDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#f20808",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%", // Full width for better touch area
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#4F46E5",
    padding: 12, // Increased padding for a more prominent button
    borderRadius: 5,
    alignItems: "center",
    width: "100%", // Full width for consistency
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    paddingTop:15,
  },
  backButton: {
    marginBottom: 20,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  requestProperty: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  requestDetails: {
    marginBottom: 10,
    gap: 6,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
  },
  createdAt: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    color: "#1F2937",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
