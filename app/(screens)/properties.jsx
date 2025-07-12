import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
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
import PropertyCard from "../../components/property-card";
import { getApartmentsWithProperty } from "../../services/apartmentService";

export default function PropertiesScreen() {
  const router = useRouter();

  const [apartments, setApartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // Default to 'available'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
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

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icons.Ionicons name="arrow-back-outline" size={24} color="#0a0a0a" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Find Your Home</Text>
      </View>

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
    marginBottom: 7,
    marginTop: 30,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
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
