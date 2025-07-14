import { supabase } from '../utils/supabase-client';

/**
 * Inserts a new profile record into the "profiles" table.
 *
 * @param {Object} profileData - Data for the profile.
 * @param {string} profileData.name - The full name of the user.
 * @param {string} profileData.email - The user's email address.
 * @param {string} [profileData.role='user'] - The user's role (e.g., 'user' or 'admin').
 *
 * @returns {Promise<Object>} The inserted profile record.
 *
 * @throws Will throw an error if the insert operation fails.
 */

export async function user_profile({ name, email, role = 'user' }) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        name,
        email,
        role,
      },
    ])
    .single();

  if (error) {
    console.error('Error creating profile:', error.message);
    throw error;
  }
  return data;
}

export async function getUserIdByEmail(email) {
  const { data, error } = await supabase
    .from('users') // Change this to your actual table name if different
    .select('*')
    .eq('email', email) // Assuming you have an 'email' column
    .single(); // Get a single record

  if (error) {
    console.error('Error retrieving user ID:', error.message);
    throw error; // Propagate the error
  }

  return data ? data.id : null; // Return the ID or null if not found
}

export async function request_maintenance({
  user_id,
  case_title,
  description,
  files_url = [],
  created_at,
  status = 'pending'
}) {

  const { data, error } = await supabase
    .from('maintenance')
    .insert({
      user_id,
      case_title,
      description,
      images: files_url,
      created_at,
      status,
    }).select()
    .single();

  if (error) {
    console.error('Error creating marketplace application:', error.message);
    throw error;
  }

  console.log("Inserted Maintenance Request: ", data);

  return data;
}

export async function uploadMultipleImages(files) {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const publicUrls = await Promise.all(uploadPromises);
    return publicUrls; // Array of public URLs
  } catch (error) {
    console.error("Failed to upload multiple images:", error.message);
    throw error;
  }
}

async function uploadImage(fileUri) {
  try {
    const fileName = fileUri.split('/').pop();
    const filePath = `uploads/${Date.now()}_${fileName}`;

    const response = await fetch(fileUri);
    const blob = await response.blob();
    const mimeType = blob.type || 'image/jpeg';

    const { error: uploadError } = await supabase.storage
      .from('evidence-images')
      .upload(filePath, blob, { contentType: mimeType });

    if (uploadError) {
      console.error('Error uploading image:', uploadError.message);
      throw uploadError;
    }

    const { data, error: urlError } = await supabase.storage
      .from('evidence-images')
      .createSignedUrl(filePath, 60 * 60); // 1 hour

    if (urlError) {
      console.error('Error getting image URL:', urlError.message);
      throw urlError;
    }

    return {
      signedUrl: data.signedUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }
}

export async function insertTenantApp(appDetails, apartmentId) {
  const data = await supabase.from('tenants_applications')
    .insert(
      {
        name: appDetails?.name,
        user_title: appDetails?.applicantTitle,
        email: appDetails?.email,
        phone: appDetails?.phone,
        employment_status: appDetails?.employmentStatus,
        employer_name: appDetails?.employer,
        numberOfMembers: appDetails?.numberOfMembers,
        references: appDetails?.references,
        emergency_name: appDetails?.emergencyName,
        emergency_contact: appDetails?.emergencyContact,
        emergency_relationship: appDetails?.emergencyRelationship,
        move_in_date: appDetails?.moveInDate,
        lease_end_date: appDetails?.lease_end_date,
        apartment_id: apartmentId

      })
    .select('apartment_id').single();

  if (data.error) {
    console.error('Error inserting tenant application:', data.error.message);
    return { data: null, error: data.error };
  }

  return data;
}

export const getApartmentsWithProperty = async () => {
  const { data, error } = await supabase
    .from('property_apartments')
    .select(`
      *,
      properties (
        property_name,
        property_type,
        street_address,
        city,
        amenities,
        property_image,
        rules
      )
    `);

  if (error) {
    console.error('Error fetching apartments:', error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    propertyId: item.property_id,
    propertyName: `${item.properties.property_name}, ${item.properties.property_type.charAt(0).toUpperCase() + item.properties.property_type.slice(1)}`,
    unit: item.unit,
    status: item.status,
    monthlyRent: item.monthly_rent,
    amenities: item.properties.amenities,
    rules: item.properties.rules,
    bedrooms: item.numberOfbedRooms || 0,
    bathrooms: item.numberOfBath || 0,
    squareFeet: item.squareFeet || 0,
    location: item.properties.street_address + ', ' + item.properties.city,
    owner: item?.owner || 'N/A',
    ownerContact: item?.ownerContact || '',
    images: item.unitImages || [], // Assuming unitImages is an array of image URLs
  }));
};

// get tenant application by email
export async function fetchApplicationByEmail(email) {
  if (!email) {
    console.error('Email was not recieved!')
    return;
  }

  const { data, error } = await supabase.from('tenants_applications')
    .select(`
      *,
      property_apartments (
        unit,
        properties (
        property_name,
        property_type,
        street_address,
        city
        )
      )`
    )
    .eq('email', email);

  if (error) {
    console.error(`Error fetching requests of ${email}:`, error);
    return [];
  }

  return data;
}

export async function deleteApplication(id) {
  const { error } = await supabase
    .from('tenants_applications')
    .delete()
    .eq('id', id)

  if (error) return error;
}
