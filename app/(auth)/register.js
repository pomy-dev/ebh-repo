import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Icons } from '../../constant/icons';
import { useAuth } from '../../context/app-state/auth-context'

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const { onRegister } = useAuth();

  const handleRegister = async () => {
    setLoading(true);
    // Basic validation
    if (!name || !email || !password || !phone || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await onRegister(name, email, phone, password, confirmPassword, aptKey);
    if (result?.error) {
      setError(result.msg);
      setLoading(false);
      console.log(result.msg)
    } else {
      console.log(result.msg || 'Registration successful!');
      setLoading(false);
      router.push('/login');
    }

  };

  return (

    <View style={styles.container}>
      <View
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icons.Ionicons name='arrow-back-outline' size={24} color="#0a0a0a" />
        </TouchableOpacity>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {error && (
          <View
            style={styles.errorContainer}
          >
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View
          style={styles.form}
        >
          <View style={styles.inputContainer}>
            <Icons.AntDesign name='user' size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icons.Ionicons name='mail-outline' size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icons.Feather name='phone' size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icons.Ionicons name='lock-closed-outline' size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ?
                <Icons.Ionicons name='eye-off-outline' size={20} color="#6B7280" /> :
                <Icons.Ionicons name='eye-outline' size={20} color="#6B7280" />
              }
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icons.Ionicons name='lock-closed-outline' size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              {showConfirmPassword ?
                <Icons.Ionicons name='eye-off-outline' size={20} color="#6B7280" /> :
                <Icons.Ionicons name='eye-outline' size={20} color="#6B7280" />
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} disabled={loading} onPress={handleRegister}>
            {loading ?
              (<ActivityIndicator size={30} color='#ffffff' />)
              : (<Text style={styles.buttonText}>Sign Up</Text>)}
          </TouchableOpacity>
        </View>

        <View
          style={styles.footer}
        >
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text
              style={styles.signInText}
              onPress={() => router.push('/(auth)/login')}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 16,
  },
  backButton: {
    padding: 8,
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginLeft: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signInText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});

export default Register;