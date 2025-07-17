import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icons } from '../../constant/icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../../context/app-state/auth-context';
import { request_maintenance, uploadImage } from '../../services/supabase-services';

const generateId = () => `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const Maintenance = () => {
    const router = useRouter();
    const { authState } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Request permissions
    const requestPermissions = async () => {
        if (Platform.OS !== 'web') {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
                Alert.alert(
                    'Insufficient permissions!',
                    'You need to grant camera and media library permissions to use this feature.',
                    [{ text: 'OK' }]
                );
                return false;
            }
            return true;
        }
        return true;
    };

    // Take photo with camera
    const takePhoto = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                handleImageSelected(result.assets[0]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            setError('Failed to take photo. Please try again.');
        }
    };

    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 0.8,
                allowsEditing: false,
                allowsMultipleSelection: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                result.assets.forEach(asset => {
                    handleImageSelected(asset);
                });
                const uris = result.assets.map((asset) => ({ uri: asset.uri }));
                console.log('Picked URIs:', uris);
                return uris;
            }
            return [];
        } catch (error) {
            console.error('Error picking image:', error);
            setError('Failed to select image. Please try again.');
        }
    };

    const handleImageSelected = async (asset) => {
        try {
            // Get file info (size, extension, etc.)
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);

            // Create a more suitable object for our state and later upload
            const newImage = {
                id: generateId(),
                uri: asset.uri,
                name: asset.uri.split('/').pop() || `image-${Date.now()}.jpg`,
                type: `image/${asset.uri.split('.').pop() || 'jpeg'}`,
                size: fileInfo.size,
                localPath: asset.uri
            };

            setImages(prevImages => [...prevImages, newImage]);
        } catch (error) {
            console.error('Error processing image:', error);
            setError('Failed to process image. Please try again.');
        }
    };

    const removeImage = (id) => {
        setImages(images.filter(image => image.id !== id));
    };

    // Submit the form
    const handleSubmit = async () => {
        // Basic validation
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        if (!description.trim()) {
            setError('Description is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {

            if (!authState || authState.authenticated === null) {
                setError('Error: Authentication state is null');
                return;
            }

            if (!authState.authenticated || !authState.user) {
                setError('Error: User is not authenticated');
                return;
            }

            const tenantId = authState.user.tenant_id;
            console.log('Tenant Id:', tenantId)

            const imageUrls = await Promise.all(images.map(async (file) => {
                const httpsUrl = await uploadImage('uploads', file)

                if (!httpsUrl) {
                    console.error("Failed to upload image");
                    return null;
                }

                return httpsUrl;
            }));

            const submitData = { tenant_id: tenantId, case_title: title, description, imageUrls: imageUrls?.filter(url => url !== null) };

            const data = await request_maintenance(submitData);

            if (!data) {
                setLoading(false);
                setError('Failed to submit maintenance request. Please try again.');
                return;
            } else {
                setLoading(false);
                Alert.alert(
                    'Success',
                    'Your maintenance request has been submitted.',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
                setTitle('');
                setDescription('');
                setImages([]);
                setError(null);
                return;
            }

        } catch (err) {
            console.error('Error submitting form:', err);
            setLoading(false);
            setError('Failed to submit maintenance request. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Icons.Ionicons name='arrow-back-outline' size={24} color="#0a0a0a" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Maintenance Request</Text>
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.form}>
                    <Text style={styles.label}>Title</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Brief description of the issue"
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                        />
                    </View>

                    <Text style={styles.label}>Description</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Provide detailed information about the issue"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                        />
                    </View>

                    <Text style={styles.label}>Images</Text>
                    <Text style={styles.helperText}>Add photos to help us understand the issue better</Text>

                    <View style={styles.imageOptionsContainer}>
                        <TouchableOpacity style={styles.imageOption} onPress={takePhoto}>
                            <Icons.AntDesign name='camerao' size={24} color="#4F46E5" />
                            <Text style={styles.imageOptionText}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.imageOption} onPress={pickImage}>
                            <Icons.Ionicons name='images-outline' size={24} color="#4F46E5" />
                            <Text style={styles.imageOptionText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>

                    {images.length > 0 && (
                        <View style={styles.imagesPreviewContainer}>
                            <Text style={styles.imagesPreviewTitle}>Selected Images ({images.length})</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
                                {images.map((image) => (
                                    <View key={image.id} style={styles.imagePreview}>
                                        <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage(image.id)}
                                        >
                                            <Icons.MaterialIcons name='highlight-remove' size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, loading && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >

                        <View style={styles.buttonContent}>
                            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Icons.Ionicons name='send-outline' size={20} color="#FFFFFF" style={styles.buttonIcon} />}
                            <Text style={styles.buttonText}>Submit Request</Text>
                        </View>
                    </TouchableOpacity>
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
        marginBottom: 24,
        marginTop: 16,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginLeft: 12,
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
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    helperText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
    },
    input: {
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
    },
    textAreaContainer: {
        height: 160,
    },
    textArea: {
        height: 140,
    },
    imageOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    imageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        padding: 12,
        flex: 0.48,
    },
    imageOptionText: {
        marginLeft: 8,
        color: '#4F46E5',
        fontWeight: '500',
    },
    imagesPreviewContainer: {
        marginBottom: 24,
    },
    imagesPreviewTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 12,
    },
    imagesScroll: {
        flexDirection: 'row',
        padding: 8
    },
    imagePreview: {
        position: 'relative',
        marginRight: 10
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#EF4444',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#4F46E5',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Maintenance;