import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { Apartment, RentRequest } from '../types';
import { Icons } from '../constant/icons';

interface PropertyCardProps {
  apartment: Apartment;
}

const { width: screenWidth } = Dimensions.get('window');

export default function PropertyCard({ apartment }: PropertyCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    monthlyIncome: '',
    employmentStatus: '',
    employer: '',
    references: '',
    moveInDate: ''
  });

  // Gallery images for different angles of the apartment
  const galleryImages = [
    apartment.image,
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
    'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg',
    'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg',
    'https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg',
    'https://images.pexels.com/photos/1571473/pexels-photo-1571473.jpeg'
  ];

  const handleRequestSubmit = () => {
    if (!formData.applicantName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Request Submitted',
      'Your application has been sent to the property owner. You will receive a response within 24-48 hours.',
      [{ text: 'OK', onPress: () => setShowModal(false) }]
    );
  };

  const openGallery = (index: number = 0) => {
    setSelectedImageIndex(index);
    setShowGallery(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setShowModal(true)}>
        <Image source={{ uri: apartment.image }} style={styles.image} />
        <View style={styles.overlay}>
          <View style={[styles.statusBadge, { backgroundColor: apartment.isOccupied ? '#EF4444' : '#10B981' }]}>
            <Text style={styles.statusText}>
              {apartment.isOccupied ? 'Occupied' : 'Available'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.propertyName}>{apartment.propertyName}</Text>
          <Text style={styles.unit}>Unit {apartment.unit}</Text>

          <View style={styles.locationRow}>
            <Icons.AntDesign name='enviromento' size={16} color="#6B7280" />
            <Text style={styles.location}>{apartment.location}</Text>
          </View>

          <View style={styles.priceRow}>
            <Icons.MaterialIcons name='attach-money' size={20} color="#059669" />
            <Text style={styles.price}>{apartment.monthlyRent}/month</Text>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detail}>
              <Icons.FontAwesome name='home' size={16} color="#6B7280" />
              <Text style={styles.detailText}>{apartment.bedrooms} bed</Text>
            </View>
            <View style={styles.detail}>
              <Icons.FontAwesome name='bath' size={16} color="#6B7280" />
              <Text style={styles.detailText}>{apartment.bathrooms} bath</Text>
            </View>
            <View style={styles.detail}>
              <Icons.MaterialCommunityIcons name='tape-measure' size={16} color="#6B7280" />
              <Text style={styles.detailText}>{apartment.squareFeet} sq ft</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.amenitiesButton,
              apartment.isOccupied && styles.amenitiesButtonDisabled
            ]}
            onPress={() => !apartment.isOccupied && openGallery()}
            disabled={apartment.isOccupied}
          >
            <Icons.AntDesign name='picture' size={16} color={apartment.isOccupied ? "#9CA3AF" : "#2563EB"} />
            <Text style={[
              styles.amenitiesButtonText,
              apartment.isOccupied && styles.amenitiesButtonTextDisabled
            ]}>
              {apartment.isOccupied ? 'Gallery Unavailable' : 'View Gallery'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Gallery Modal */}
      <Modal visible={showGallery} animationType="fade" transparent>
        <View style={styles.galleryContainer}>
          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>
              {apartment.propertyName} - Unit {apartment.unit}
            </Text>
            <TouchableOpacity onPress={() => setShowGallery(false)}>
              <Icons.AntDesign name='close' size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.galleryContent}>
            <TouchableOpacity style={styles.galleryNavLeft} onPress={prevImage}>
              <Text style={styles.galleryNavText}>‹</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: galleryImages[selectedImageIndex] }}
              style={styles.galleryImage}
              resizeMode="cover"
            />

            <TouchableOpacity style={styles.galleryNavRight} onPress={nextImage}>
              <Text style={styles.galleryNavText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.galleryFooter}>
            <Text style={styles.galleryCounter}>
              {selectedImageIndex + 1} of {galleryImages.length}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
            >
              {galleryImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.thumbnailActive
                  ]}
                >
                  <Image source={{ uri: image }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{apartment.propertyName}</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <Image source={{ uri: apartment.image }} style={styles.modalImage} />

          <View style={styles.modalContent}>
            <View style={styles.modalRow}>
              <Text style={styles.modalUnit}>Unit {apartment.unit}</Text>
              <View style={[styles.statusBadge, { backgroundColor: apartment.isOccupied ? '#EF4444' : '#10B981' }]}>
                <Text style={styles.statusText}>
                  {apartment.isOccupied ? 'Occupied' : 'Available'}
                </Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Icons.AntDesign name='enviromento' size={18} color="#6B7280" />
              <Text style={styles.modalLocation}>{apartment.location}</Text>
            </View>

            <View style={styles.priceRow}>
              <Icons.MaterialIcons name='attach-money' size={24} color="#059669" />
              <Text style={styles.modalPrice}>{apartment.monthlyRent}/month</Text>
            </View>

            {/* Gallery Button in Modal */}
            <TouchableOpacity
              style={[
                styles.modalGalleryButton,
                apartment.isOccupied && styles.modalGalleryButtonDisabled
              ]}
              onPress={() => !apartment.isOccupied && openGallery()}
              disabled={apartment.isOccupied}
            >
              <Icons.AntDesign name='picture' size={20} color={apartment.isOccupied ? "#9CA3AF" : "#FFFFFF"} />
              <Text style={[
                styles.modalGalleryButtonText,
                apartment.isOccupied && styles.modalGalleryButtonTextDisabled
              ]}>
                {apartment.isOccupied ? 'Gallery Unavailable' : 'View Photo Gallery'}
              </Text>
            </TouchableOpacity>

            <View style={styles.apartmentDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Bedrooms:</Text>
                <Text style={styles.detailValue}>{apartment.bedrooms}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Bathrooms:</Text>
                <Text style={styles.detailValue}>{apartment.bathrooms}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Square Feet:</Text>
                <Text style={styles.detailValue}>{apartment.squareFeet}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Owner:</Text>
                <Text style={styles.detailValue}>{apartment.owner}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {apartment.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={styles.rulesHeader}
                onPress={() => setShowRules(!showRules)}
              >
                <Text style={styles.sectionTitle}>Property Rules</Text>
                {showRules ? <Icons.Feather name='chevron-up' size={20} color="#374151" /> : <Icons.Feather name='chevron-down' size={20} color="#374151" />}
              </TouchableOpacity>

              {showRules && (
                <View style={styles.rulesContainer}>
                  {apartment.rules.map((rule, index) => (
                    <Text key={index} style={styles.ruleText}>• {rule}</Text>
                  ))}
                </View>
              )}
            </View>

            {!apartment.isOccupied && !showRequestForm && (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => setShowRequestForm(true)}
              >
                <Text style={styles.requestButtonText}>Request to Occupy</Text>
              </TouchableOpacity>
            )}

            {showRequestForm && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Application Form</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.applicantName}
                    onChangeText={(text) => setFormData({ ...formData, applicantName: text })}
                    placeholder="Enter your full name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Employment Status</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.employmentStatus}
                    onChangeText={(text) => setFormData({ ...formData, employmentStatus: text })}
                    placeholder="e.g., Full-time, Part-time, Self-employed"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Employer</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.employer}
                    onChangeText={(text) => setFormData({ ...formData, employer: text })}
                    placeholder="Enter your employer name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>References</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.references}
                    onChangeText={(text) => setFormData({ ...formData, references: text })}
                    placeholder="Provide contact information for references"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Preferred Move-in Date</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.moveInDate}
                    onChangeText={(text) => setFormData({ ...formData, moveInDate: text })}
                    placeholder="MM/DD/YYYY"
                  />
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowRequestForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleRequestSubmit}
                  >
                    <Icons.Feather name='send' size={16} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Submit Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  unit: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  amenitiesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  amenitiesButtonDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  amenitiesButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  amenitiesButtonTextDisabled: {
    color: '#9CA3AF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
  },
  modalImage: {
    width: '100%',
    height: 250,
  },
  modalContent: {
    padding: 16,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  modalLocation: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 4,
  },
  modalGalleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 16,
    gap: 8,
  },
  modalGalleryButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  modalGalleryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalGalleryButtonTextDisabled: {
    color: '#9CA3AF',
  },
  apartmentDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  rulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rulesContainer: {
    marginTop: 12,
  },
  ruleText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  requestButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#059669',
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Gallery Styles
  galleryContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  galleryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  galleryImage: {
    width: screenWidth - 40,
    height: screenWidth - 40,
    borderRadius: 12,
  },
  galleryNavLeft: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    backgroundColor: 'rgba(5, 5, 5, 0.4)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  galleryNavRight: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    backgroundColor: 'rgba(5, 5, 5, 0.4)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  galleryNavText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  galleryFooter: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  galleryCounter: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  thumbnailContainer: {
    flexDirection: 'row',
  },
  thumbnail: {
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#2563EB',
  },
  thumbnailImage: {
    width: 60,
    height: 60,
  },
});