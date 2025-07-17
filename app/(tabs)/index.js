import { useRouter } from "expo-router";
import { Icons } from "../../constant/icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/app-state/auth-context";
import { usePaymentContext } from "../../context/app-state/PaymentContext";
import { useEffect, useState, useRef } from "react";
import { apartmentUserDetails } from "../../services/supabase-services";
import { Picker } from "@react-native-picker/picker";

const HomeScreen = () => {
  const { authState } = useAuth();
  const { setId, tenantID } = usePaymentContext();

  const [tenantDetails, setTenantDetails] = useState([]);
  const [currentTenantDetails, setCurrentTenantDetails] = useState(0);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Shimmer animation loop
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

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
    const fetchTenantInfo = async () => {
      const tenantInfo = await apartmentUserDetails(authState?.user?.id);
      if (!tenantInfo) {
        return;
      }
      setTenantDetails(tenantInfo);
      setId({
        id: tenantInfo[currentTenantDetails]?.id,
        aptId: tenantInfo[currentTenantDetails]?.property_apartments?.id,
      });
      // setId(tenantInfo[currentTenantDetails].id)
    };

    fetchTenantInfo();
  }, []);

  const renderErrorTenant = () => {
    if (!tenantDetails && tenantDetails.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>No Apartment Details Found</Text>
          <Text style={styles.errorText}>
            Oops! Looks like your apartment details could not be found. Please
            contact the owner.
          </Text>
        </View>
      );
    }
  };

  const renderLoadingCard = () => {
    return (
      <View style={styles.propertyCard}>
        <Animated.View
          style={[
            styles.loadingImage,
            {
              opacity: shimmerAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 0.8, 0.3],
              }),
              transform: [
                {
                  translateX: shimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 300],
                  }),
                },
              ],
            },
          ]}
        />
        <View style={styles.propertyInfo}>
          <Animated.View
            style={[
              styles.loadingText,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.8, 0.3],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingTextSmall,
              {
                opacity: shimmerAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.8, 0.3],
                }),
              },
            ]}
          />
          <View style={styles.propertyMeta}>
            <View style={styles.propertyDetail}>
              <Animated.View
                style={[
                  styles.loadingTextSmall,
                  {
                    opacity: shimmerAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 0.8, 0.3],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.loadingText,
                  {
                    opacity: shimmerAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 0.8, 0.3],
                    }),
                  },
                ]}
              />
            </View>
            <View style={styles.propertyDetail}>
              <Animated.View
                style={[
                  styles.loadingTextSmall,
                  {
                    opacity: shimmerAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 0.8, 0.3],
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.loadingText,
                  {
                    opacity: shimmerAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 0.8, 0.3],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const router = useRouter();
  const { name } = authState.user;

  return (
    <View style={styles.container}>
      <View
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 300 }}
        style={styles.header}
      >
        <View style={styles.picker}>
          <Text style={styles.greeting}>{name}</Text>
          <View style={styles.unitPickerContainer}>
            <Picker
              selectedValue={currentTenantDetails}
              onValueChange={(itemValue) => {
                setCurrentTenantDetails(itemValue);
                setId({
                  id: tenantDetails[itemValue]?.id,
                  aptId:
                    tenantDetails[itemValue]?.property_apartments?.id,
                });
         
              }}
              style={styles.unitPicker}
              mode="dropdown"
            >
              {tenantDetails.map((tenant, index) => (
                <Picker.Item
                  key={index}
                  label={
                    `${tenant?.property_apartments?.unit}-${tenant?.property_apartments.properties?.property_name}` ||
                    `Unit ${index + 1}`
                  }
                  value={index}
                />
              ))}
            </Picker>
          </View>
        </View>
        <Text style={styles.subtitle}>Welcome to your dashboard</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 100 }}
        >
          {tenantDetails.length === 0 ? (
            renderErrorTenant()
          ) : tenantDetails[currentTenantDetails] ? (
            <View style={styles.propertyCard}>
              <Image
                source={{
                  uri: tenantDetails[currentTenantDetails]?.property_apartments
                    ?.unitImages[0],
                }}
                style={styles.propertyImage}
              />
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyName}>
                  {
                    tenantDetails[currentTenantDetails]?.property_apartments
                      ?.properties?.property_name
                  }
                  ,
                  {
                    tenantDetails[currentTenantDetails]?.property_apartments
                      ?.properties?.property_type
                  }
                </Text>
                <Text style={styles.propertyAddress}>
                  {
                    tenantDetails[currentTenantDetails]?.property_apartments
                      ?.unit
                  }
                </Text>
                <View style={styles.propertyMeta}>
                  <View style={styles.propertyDetail}>
                    <Text style={styles.propertyDetailLabel}>Lease Ends</Text>
                    <Text style={styles.propertyDetailValue}>
                      {tenantDetails[currentTenantDetails]?.lease_end_date}
                    </Text>
                  </View>
                  <View style={styles.propertyDetail}>
                    <Text style={styles.propertyDetailLabel}>Rent Due</Text>
                    <Text style={styles.propertyDetailValue}>
                      E
                      {
                        tenantDetails[currentTenantDetails]?.property_apartments
                          ?.monthly_rent
                      }
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            renderLoadingCard()
          )}
        </View>

        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 200 }}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/payments")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#EFF6FF" }]}>
                <Icons.Feather name="dollar-sign" size={24} color="#2563EB" />
              </View>
              <Text style={styles.actionText}>Pay Rent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                router.push("/(screens)/maintenance");
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#F0FDF4" }]}>
                <Icons.MaterialCommunityIcons
                  name="clipboard-list-outline"
                  size={24}
                  color="#16A34A"
                />
              </View>
              <Text style={styles.actionText}>Maintenance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(screens)/properties")}
            >
              <View style={[styles.actionIcon, { backgroundColor: "#F5F3FF" }]}>
                <Icons.MaterialIcons
                  name="other-houses"
                  size={24}
                  color="#8B5CF6"
                />
              </View>
              <Text style={styles.actionText}>Houses</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: "#FEF2F2" }]}>
                <Icons.AntDesign name="bells" size={24} color="#DC2626" />
              </View>
              <Text style={styles.actionText}>Alerts</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 300 }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <TouchableOpacity onPress={() => router.push("/notifications")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.notificationCard}>
            <View
              style={[styles.notificationDot, { backgroundColor: "#2563EB" }]}
            />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>
                Rent Payment Reminder
              </Text>
              <Text style={styles.notificationDesc}>
                Your rent payment is due in 5 days
              </Text>
              <Text style={styles.notificationTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.notificationCard}>
            <View
              style={[styles.notificationDot, { backgroundColor: "#16A34A" }]}
            />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Maintenance Update</Text>
              <Text style={styles.notificationDesc}>
                Your request has been completed
              </Text>
              <Text style={styles.notificationTime}>Yesterday</Text>
            </View>
          </View>
        </View>

        <View
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 400 }}
        >
          <TouchableOpacity style={styles.communityCard}>
            <View style={styles.communityContent}>
              <Text style={styles.communityTitle}>Municipal News</Text>
              <Text style={styles.communityDesc}>
                Street-lights re-wiring to start from 05 May 2025...
              </Text>
              <View style={styles.communityButton}>
                <Text style={styles.communityButtonText}>Read More</Text>
                <Icons.Ionicons
                  name="arrow-forward"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
            </View>
            <Image
              source={require("../../assets/street-light.jpg")}
              style={styles.communityImage}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  unitPickerContainer: {
    width: 150,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  unitPicker: {
    height: 50,
    paddingHorizontal: 3,
    color: "#1F2937",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  errorContainer: {
    backgroundColor: "#FFF1F2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
  },
  propertyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    elevation: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  propertyImage: {
    width: "100%",
    height: 160,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  propertyMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  propertyDetail: {},
  propertyDetailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  propertyDetailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  loadingImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#E5E7EB",
    transform: [{ translateX: -100 }],
  },
  loadingText: {
    width: "80%",
    height: 20,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },
  loadingTextSmall: {
    width: "60%",
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "500",
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  notificationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  notificationDesc: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  communityCard: {
    flexDirection: "row",
    backgroundColor: "#4F46E5",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  communityContent: {
    flex: 3,
    padding: 16,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  communityDesc: {
    fontSize: 14,
    color: "#E0E7FF",
    marginBottom: 16,
    lineHeight: 20,
  },
  communityButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  communityButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  communityImage: {
    flex: 2,
    height: "100%",
  },
});

export default HomeScreen;
