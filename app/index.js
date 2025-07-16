import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.welcomeText}>Welcome to naku ekhaya</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.buttonText}>Continue To Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#508DCA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    // width: 100,
    // height: 100,
    marginBottom: 20,
    // borderRadius: 50,
    // borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginBottom: 28,
  },
  iconWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 36,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#508DCA',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderStyle: 'solid',
    elevation: 2,
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  welcomeText: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '600',
    padding: 30,
  },

});
