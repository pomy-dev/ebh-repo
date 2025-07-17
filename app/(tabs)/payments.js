import React, { useState, useEffect  } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Icons } from "../../constant/icons";
import BottomSheetModal from "../../components/bottom-sheet";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { usePaymentContext } from "../../context/app-state/PaymentContext";

// local modules
import { supabase } from "../../utils/supabase-client";
import { useAuth } from "../../context/app-state/auth-context";
import { getUserIdByEmail } from "../../services/supabase-services";

const PaymentsScreen = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [showSheet2, setShowSheet2] = useState(false);
  const [showSheet3, setShowSheet3] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedMethod2, setSelectedMethod2] = useState(null);
  const [month, setMonth] = useState("january");
  const [amount, setAmount] = useState(null);
  const [account, setAccount] = useState(null);
  const [reference, setReference] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [payments, setPayments] = useState([]);
  const [user_id, setUser_id] = useState("");

  const router = useRouter();
  const { authState } = useAuth();
  const { name, email, user_number } = authState?.user;

  const {tenantID } = usePaymentContext();

 

  useEffect(() => {
    const fetchPayments = async () => {
      // Fetch payments for the user
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id", tenantID?.id);

      if (error) {
        console.error("Error fetching payments:", error);
      } else {
        setPayments(data);
        setTransactionStatus(false); // Set the payments state
      }
    };

    fetchPayments(); // Initial fetch
  }, [transactionStatus]);

useFocusEffect(
  React.useCallback(() => {
    const fetchPayments = async () => {
      if (!tenantID?.id) return; // safeguard
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id", tenantID.id);

      if (error) {
        console.error("Error fetching payments:", error);
      } else {
        setPayments(data);
        setTransactionStatus(false);
      }
    };

    fetchPayments();
  }, [tenantID?.id, transactionStatus])
);


  const savePayment = async () => {
    let method = selectedMethod2;
    const { data, error } = await supabase
      .from("payments")
      .insert({
        month,
        amount,
        method,
        account,
        reference,
        updated_at: new Date().toISOString(),
        tenant_id: tenantID?.id,
        apt_id: tenantID?.aptId,
      })
      .select();

    if (error) {
      setShowSheet2(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
      setTransactionStatus(true);
      setShowSheet2(false);
    }
  };

  const renderForm = () => {
    if (selectedMethod === "card") {
      return (
        <View style={styles.container}>
          <View style={styles.header2}>
            <Image
              source={require("../../assets/credit-card.png")}
              style={styles.logo}
            />
            <Text style={styles.headerText}>{selectedMethod} Details</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              placeholder="Enter your card number"
              style={styles.input}
              placeholderTextColor="#6B7280"
              onChangeText={(value) => setAccount(value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              placeholder="Enter Amount"
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#6B7280"
              onChangeText={(value) => setAmount(value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reference</Text>
            <TextInput
              placeholder="Enter reference"
              style={styles.input}
              placeholderTextColor="#6B7280"
              onChangeText={(value) => setReference(value)}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setSelectedMethod("confirm");
              setShowSheet3(true);
            }}
            style={styles.payButton}
          >
            <Text style={styles.payButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (selectedMethod === "momo") {
      return (
        <View style={styles.container}>
          <View style={styles.header2}>
            <Image
              source={require("../../assets/momo.jpg")}
              style={styles.logo}
            />
            <Text style={styles.headerText}>{selectedMethod} Details</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="+268"
              style={styles.input}
              placeholderTextColor="#6B7280"
              onChangeText={(value) => setAccount(value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              placeholder="Enter Amount"
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#6B7280"
              onChangeText={(value) => setAmount(value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reference</Text>
            <TextInput
              placeholder="Enter reference"
              style={styles.input}
              placeholderTextColor="#6B7280"
              onChangeText={(value) => setReference(value)}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setSelectedMethod("confirm");
              setShowSheet3(true);
            }}
            style={styles.payButton}
          >
            <Text style={styles.payButtonText}>Submit Payment</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (selectedMethod === "insta") {
      return (
        <View style={styles.container}>
          <View style={styles.header2}>
            <Image
              source={require("../../assets/instacash.png")}
              style={styles.logo}
            />
            <Text style={styles.headerText}>{selectedMethod} Details</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="+268"
              style={styles.input}
              placeholderTextColor="#6B7280"
              onChangeText={(value) => setAccount(value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              placeholder="Enter Amount"
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#6B7280"
              onChangeText={(value) => setAmount(value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reference</Text>
            <TextInput
              placeholder="Enter reference"
              style={styles.input}
              placeholderTextColor="#6B7280"
              onChangeText={(value) => setReference(value)}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setSelectedMethod("confirm");
              setShowSheet3(true);
            }}
            style={styles.payButton}
          >
            <Text style={styles.payButtonText}>Submit Payment</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (selectedMethod === "confirm") {
      return (
        <View style={[styles.container, { justifyContent: "center" }]}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>You are paying:</Text>
            <Text style={styles.label}>Amount: {amount}</Text>
            <Text style={styles.label}>Account: {account}</Text>
            <Text style={styles.label}>Reference: {reference}</Text>
            <Text style={{ fontSize: 11, textAlign: "center" }}>
              ***please note no fund for misdirected transaction***
            </Text>
          </View>
          <View style={styles.payButtonText}>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                savePayment();
              }}
              style={styles.payButton}
            >
              {loading ? (
                <ActivityIndicator size={30} color="#ffffff" />
              ) : (
                <Text style={styles.payButtonText}>Submit Payment</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (selectedMethod === "cash") {
      return <Text>No info needed. Pay with cash at delivery.</Text>;
    }

    return <Text>No info needed. Pay with cash at delivery</Text>;
  };

  const PaymentList = () => {
    // Get the last three payments
    const displayedPayments = payments.sort((a, b) => b.id - a.id).slice(0, 3);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {displayedPayments.map((item) => (
          <TouchableOpacity key={item.id} style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <View style={styles.historyIconContainer}>
                <Icons.Feather name="dollar-sign" size={24} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.historyTitle}>
                  {item.reference || "Payment"}
                </Text>
                <Text style={styles.historyDate}>{item.method || "card"}</Text>
                <Text style={styles.historyDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text style={styles.historyAmount}>E{item.amount}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const handleMethodSelect = (method) => {
    setShowSheet(false);
    setShowSheet2(true);
    setSelectedMethod(method);
    setSelectedMethod2(method);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.upcomingCard}>
          <Text style={styles.upcomingTitle}>Upcoming Payment</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>E</Text>
            <Text style={styles.amountValue}>1,450</Text>
            <Text style={styles.amountCents}>.00</Text>
          </View>
          <Text style={styles.dueDate}>Due on April 30, 2025</Text>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => setShowSheet(true)}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        <BottomSheetModal
          visible={showSheet}
          onClose={() => {
            setShowSheet(false);
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Payment Methods
          </Text>
          <View style={styles.methodsContainer}>
            <TouchableOpacity
              style={styles.methodCard}
              onPress={() => handleMethodSelect("card")}
            >
              <Image
                source={require("../../assets/credit-card.png")}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 5,
                }}
              />
              <Text style={[styles.methodText]}>Credit Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.methodCard}
              onPress={() => handleMethodSelect("momo")}
            >
              <Image
                source={require("../../assets/momo.jpg")}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 5,
                }}
              />
              <Text style={[styles.methodText]}>MoMo Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.methodCard}
              onPress={() => handleMethodSelect("insta")}
            >
              <Image
                source={require("../../assets/instacash.png")}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 5,
                }}
              />
              <Text style={[styles.methodText]}>Insta-Cash</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>

        <BottomSheetModal
          visible={showSheet2}
          onClose={() => {
            setShowSheet2(false);
          }}
        >
          <ScrollView>{renderForm()}</ScrollView>
        </BottomSheetModal>

        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(screens)/paymentDetailScreen",
                  params: {
                    paymentData: JSON.stringify(payments),
                  },
                });
              }}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <PaymentList />
        </View>

        <View>
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
            Quick Actions
          </Text>

          <TouchableOpacity style={styles.actionLink}>
            <View style={styles.actionLinkLeft}>
              <View style={[styles.actionIcon, { backgroundColor: "#EFF6FF" }]}>
                <Icons.MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#2563EB"
                />
              </View>
              <Text style={styles.actionLinkText}>Set Up Auto-Pay</Text>
            </View>
            <Icons.MaterialIcons
              name="chevron-right"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionLink}>
            <View style={styles.actionLinkLeft}>
              <View style={[styles.actionIcon, { backgroundColor: "#F0FDF4" }]}>
                <Icons.MaterialIcons
                  name="file-open"
                  size={20}
                  color="#16A34A"
                />
              </View>
              <Text style={styles.actionLinkText}>View Payment Receipts</Text>
            </View>
            <Icons.MaterialIcons
              name="chevron-right"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  //payform
  header2: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8, // Space between logo and text
  },
  logo: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  inputContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  payButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  //endform

  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  upcomingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  upcomingTitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1F2937",
    lineHeight: 56,
  },
  amountCents: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
  },
  dueDate: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 24,
  },
  payButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  methodsContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  methodCard: {
    width: "100%",
    borderRadius: 50,
    padding: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 15,
  },
  methodText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#525150",
    marginTop: 8,
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
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  actionLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  actionLinkLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionLinkText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginTop: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
});

export default PaymentsScreen;
