import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Home, DollarSign, ClipboardList } from "lucide-react-native";
import { MotiView } from "moti";
import { useRouter } from 'expo-router'

export default function LandingScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100, type: "timing" }}
      >
        <Image source={require("@/assets/logo.png")} style={styles.logo} />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200, type: "timing" }}
        style={styles.iconsContainer}
      >
        <Home size={40} color="#2563EB" />
        <DollarSign size={40} color="#16A34A" />
        <ClipboardList size={40} color="#8B5CF6" />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300, type: "timing" }}
      >
        <Text style={styles.title}>Welcome to RentEase</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 400, type: "timing" }}
      >
        <Text style={styles.subtitle}>
          Report maintenance issues, view rental details, and pay rent all in one easy-to-use app.
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 500, type: "timing" }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/Login")}
        >
          <Text style={styles.buttonText}>Continue To Login</Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
    resizeMode: "contain",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
