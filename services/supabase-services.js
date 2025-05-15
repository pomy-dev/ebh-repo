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

/**
 * Inserts a new maintenance request into the "Maintenance" table.
 */
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


