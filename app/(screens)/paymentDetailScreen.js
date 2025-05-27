import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Icons } from "../../constant/icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const PaymentDetailScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { paymentData } = useLocalSearchParams();

  let payments = [];

  try {
    const parsed = JSON.parse(paymentData);
    payments = Array.isArray(parsed) ? parsed : [];

    // Apply tab filtering
    if (activeTab !== "all") {
      payments = payments.filter((p) =>
        p.status?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      payments = payments.filter((p) =>
        p.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.method?.toLowerCase().includes(searchQuery.toLowerCase()) 
      );
    }
  } catch (e) {
    console.warn("Failed to parse paymentData, using empty list", e);
  }

  const PaymentCard = ({ payment }) => {
    return (
      <TouchableOpacity style={styles.requestCard}>
        <Text style={styles.requestTitle}>
          {payment.reference || "Payment"}
        </Text>
 
        <Text style={styles.requestDesc}>
          The transaction paid with {payment.method || " no method"}
        </Text>
        <View style={styles.requestFooter}>
          <Text style={styles.requestDate}>
            Submitted: {new Date(payment.created_at).toLocaleDateString()}
          </Text>
          {/* <Text style={styles.requestPriority}>
            {payment.priority || "Normal Priority"}
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  const tabOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "inProgress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment History</Text>

      </View>

      <View style={styles.searchContainer}>
        <Icons.EvilIcons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search requests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {tabOptions.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {payments.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#6B7280" }}>
            No requests found.
          </Text>
        ) : (
          payments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  addButton: {
    backgroundColor: "#4F46E5",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    margin: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: "#1F2937",
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
    backgroundColor: "#F3F4F6",
  },
  activeTab: {
    backgroundColor: "#4F46E5",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  requestDesc: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  requestFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  requestPriority: {
    fontSize: 12,
    fontWeight: "500",
    color: "#EF4444",
  },
});

export default PaymentDetailScreen;
