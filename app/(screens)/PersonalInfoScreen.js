import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/app-state/auth-context";
import { tenantFullDetails, updateTenantDetails } from "../../services/supabase-services";
import { usePaymentContext } from "../../context/app-state/PaymentContext";

const TenantDetailScreen = () => {
  const { authState } = useAuth();
  const userId = authState?.user?.id;
  const { tenantID } = usePaymentContext();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New loading state for saving

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [relationship, setRelationship] = useState("");

  const fetchTenantDetails = async () => {
    setLoading(true);
    try {
      const data = await tenantFullDetails(tenantID?.id);
      if (Array.isArray(data) && data.length > 0) {
        setTenant(data[0]);
      } else {
        console.log("⚠️ Using mock data");
      }
    } catch (err) {
      console.error("Error fetching tenant details:", err);
      setError(err.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantID?.id) {
      fetchTenantDetails();
    } else {
      setLoading(false);
    }
  }, [tenantID]);

  useEffect(() => {
    if (tenant) {
      setName(tenant.users.name || "");
      setEmail(tenant.users.email || "");
      setUserNumber(tenant.users.user_number ? tenant.users.user_number.toString() : "");
      setEmergencyName(tenant.emergency_name || "");
      setEmergencyPhone(tenant.emergency_phone || "");
      setRelationship(tenant.relationship || "");
    }
  }, [tenant]);

  const handleSave = async () => {
    if (!name || !email || !userNumber) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsSaving(true); // Start loading state
    try {
      await updateTenantDetails(
        tenant.id,
        {
          name,
          email,
          user_number: userNumber ? parseInt(userNumber, 10) : null,
        },
        {
          emergency_name: emergencyName,
          emergency_phone: emergencyPhone,
          relationship,
        }
      );

      Alert.alert("Success", "Details updated successfully!");
      setIsEditing(false);
      fetchTenantDetails(); // Refresh tenant details after update
    } catch (error) {
      Alert.alert("Error", "Failed to update tenant details.");
      console.error(error);
    } finally {
      setIsSaving(false); // End loading state
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading tenant details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!tenant) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>No tenant details found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Tenant Details</Text>
            <Text style={styles.subtitle}>
              Lease: {tenant.lease_start_date} - {tenant.lease_end_date}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyName}>
                {tenant.property_apartments.properties.property_name}
              </Text>
              <Text style={styles.propertyAddress}>
                {tenant.property_apartments.properties.property_type} • Unit{" "}
                {tenant.property_apartments.unit}
              </Text>

              <View style={styles.propertyMeta}>
                <View style={styles.propertyDetail}>
                  <Text style={styles.propertyDetailLabel}>Monthly Rent</Text>
                  <Text style={styles.propertyDetailValue}>
                    E{tenant.property_apartments.monthly_rent}
                  </Text>
                </View>
                <View style={styles.propertyDetail}>
                  <Text style={styles.propertyDetailLabel}>Lease End</Text>
                  <Text style={styles.propertyDetailValue}>
                    {tenant.lease_end_date}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.userSection}>
              <Text style={styles.sectionTitle}>User Information</Text>

              {isEditing ? (
                <>
                  <Text style={styles.label}>Name</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="Name"
                    />
                  </View>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Email"
                      keyboardType="email-address"
                    />
                  </View>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={userNumber}
                      onChangeText={setUserNumber}
                      placeholder="User Number"
                      keyboardType="numeric"
                    />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.subtitle}>Name: {tenant.users.name}</Text>
                  <Text style={styles.subtitle}>
                    Email: {tenant.users.email}
                  </Text>
                  <Text style={styles.subtitle}>
                    User Number: {tenant.users.user_number}
                  </Text>
                </>
              )}

              <Text style={styles.sectionTitle}>Emergency Contact</Text>

              {isEditing ? (
                <>
                  <Text style={styles.label}>Name</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Emergency Contact Name"
                      value={emergencyName}
                      onChangeText={setEmergencyName}
                      maxLength={100}
                    />
                  </View>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={emergencyPhone}
                      onChangeText={setEmergencyPhone}
                      placeholder="Emergency Contact Phone"
                      keyboardType="phone-pad"
                    />
                  </View>
                  <Text style={styles.label}>Relationship</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={relationship}
                      onChangeText={setRelationship}
                      placeholder="Relationship"
                    />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.subtitle}>
                    Name: {tenant.emergency_name || "N/A"}
                  </Text>
                  <Text style={styles.subtitle}>
                    Phone: {tenant.emergency_phone || "N/A"}
                  </Text>
                  <Text style={styles.subtitle}>
                    Relationship: {tenant.relationship || "N/A"}
                  </Text>
                </>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isSaving} // Disable button while saving
              >
                {isSaving ? ( // Show loading indicator when saving
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isEditing ? "Save" : "Edit"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#1F2937",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  propertyInfo: {
    marginBottom: 16,
  },
  propertyName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1F2937",
  },
  propertyAddress: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  propertyMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  propertyDetail: {
    flex: 1,
    marginRight: 10,
  },
  propertyDetailLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  propertyDetailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  userSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
  },
  input: {
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TenantDetailScreen;