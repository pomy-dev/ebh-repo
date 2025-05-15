import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Icons } from '../../constant/icons';

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async () => {
        // Basic validation
        if (!email) {
            setError('Email address is required');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            // In a real implementation, you would call your API here
            // const result = await forgotPassword(email);

            // Mock successful response
            setError(null);
            setSuccess(true);

            // In case of error from API:
            // setError(result.msg);
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Icons.Ionicons name='arrow-back-outline' size={24} color="#0a0a0a" />
                    </TouchableOpacity>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </View>

                <View>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>Enter your email to reset your password</Text>
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {success && (
                    <View style={styles.successContainer}>
                        <Text style={styles.successText}>
                            Password reset instructions have been sent to your email address.
                        </Text>
                    </View>
                )}

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Icons.Ionicons name='mail-outline' size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            editable={!success}
                        />
                    </View>

                    {!success && (
                        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                            <Text style={styles.buttonText}>Send Reset Link</Text>
                        </TouchableOpacity>
                    )}

                    {success && (
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            <Text style={styles.secondaryButtonText}>Back to Login</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Remember your password?{' '}
                        <Text
                            style={styles.signInText}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            Login
                        </Text>
                    </Text>
                </View>
            </View>
        </ScrollView>
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
    successContainer: {
        backgroundColor: '#DCFCE7',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
    successText: {
        color: '#166534',
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
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#4F46E5',
    },
    secondaryButtonText: {
        color: '#4F46E5',
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

export default ForgotPassword;