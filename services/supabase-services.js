import { supabase } from "../utils/supabase-client";

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

export async function user_profile({ name, email, role = "user" }) {
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        name,
        email,
        role,
      },
    ])
    .single();

  if (error) {
    console.error("Error creating profile:", error.message);
    throw error;
  }
  return data;
}

export async function getUserIdByEmail(email) {
  const { data, error } = await supabase
    .from("users") // Change this to your actual table name if different
    .select("*")
    .eq("email", email) // Assuming you have an 'email' column
    .single(); // Get a single record

  if (error) {
    console.error("Error retrieving user ID:", error.message);
    throw error; // Propagate the error
  }

  return data ? data.id : null; // Return the ID or null if not found
}

export async function request_maintenance({
  tenant_id,
  case_title,
  description,
  imageUrls = [],
  status = "pending",
}) {
  const { data, error } = await supabase
    .from("maintenance")
    .insert({
      tenant_id,
      case_title,
      description,
      images: imageUrls,
      status,
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting maintenance request:", error.message);
    throw error;
  }

  console.log("Inserted Maintenance Request: ", data);

  return data;
}

export async function getMaintenanceRequestsByTenantId(tenant_id) {
  const { data, error } = await supabase
    .from("maintenance")
    .select("*")
    .eq("tenant_id", tenant_id);

  if (error) {
    console.error("Error fetching queries:", error.message);
    throw error;
  }
  // console.log(data)

  return data;
}

export async function uploadImage(path, file) {
  try {
    // Fetch the file as a Blob
    const response = await fetch(file.uri);
    const blob = await response.blob();

    // uniquely name the file
    const fileName = `${Date.now()}_${file.name}`;
    path = `${path}/${fileName}`; // Ensure the path includes the file name

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("evidence-images") // Replace with your actual bucket name
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false, // Set to true if you want to overwrite existing files
        contentType: file.mimeType || "application/octet-stream",
      });

    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    // Retrieve the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("evidence-images")
      .getPublicUrl(path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}

export async function insertTenantApp(appDetails, apartmentId) {
  const data = await supabase
    .from("tenants_applications")
    .insert({
      user_id: appDetails?.userId,
      user_title: appDetails?.applicantTitle,
      employment_status: appDetails?.employmentStatus,
      employer_name: appDetails?.employer,
      numberOfMembers: appDetails?.numberOfMembers,
      references: appDetails?.references,
      emergency_name: appDetails?.emergencyName,
      emergency_contact: appDetails?.emergencyContact,
      emergency_relationship: appDetails?.emergencyRelationship,
      move_in_date: appDetails?.moveInDate,
      lease_end_date: appDetails?.lease_end_date,
      apartment_id: apartmentId,
    })
    .select("apartment_id")
    .single();

  if (data.error) {
    console.error("Error inserting tenant application:", data.error.message);
    return { data: null, error: data.error };
  }

  return data;
}

export async function deleteTenantApp(id) {
  const { error } = await supabase
    .from("tenants_applications")
    .delete()
    .eq("id", id);

  if (error) return error;
}

export const getApartmentsWithProperty = async () => {
  const { data, error } = await supabase.from("property_apartments").select(`
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
    console.error("Error fetching apartments:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    propertyId: item.property_id,
    propertyName: `${item.properties.property_name}, ${
      item.properties.property_type.charAt(0).toUpperCase() +
      item.properties.property_type.slice(1)
    }`,
    unit: item.unit,
    status: item.status,
    monthlyRent: item.monthly_rent,
    amenities: item.properties.amenities,
    rules: item.properties.rules,
    bedrooms: item.numberOfbedRooms || 0,
    bathrooms: item.numberOfBath || 0,
    squareFeet: item.squareFeet || 0,
    location: item.properties.street_address + ", " + item.properties.city,
    owner: item?.owner || "N/A",
    ownerContact: item?.ownerContact || "",
    images: item.unitImages || [], // Assuming unitImages is an array of image URLs
  }));
};

// get tenant application by email
export async function fetchApplicationByEmail(userId) {
  if (!userId) {
    console.error("User Id was not recieved!");
    return;
  }

  const { data, error } = await supabase
    .from("tenants_applications")
    .select(
      `
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
    .eq("user_id", userId);

  if (error) {
    console.error(`Error fetching requests of ${email}:`, error);
    return [];
  }

  return data;
}

export async function deleteApplication(id) {
  const { error } = await supabase
    .from("tenants_applications")
    .delete()
    .eq("id", id);

  if (error) return error;
}

export async function makeTenant(tenant) {
  const data = await supabase
    .from("tenants")
    .insert({
      user_id: tenant?.user_id,
      apt_id: tenant?.apt_id,
      lease_start_date: tenant?.lease_start_date,
      lease_end_date: tenant?.lease_end_date,
      emergency_name: tenant?.emergency_name,
      emergency_phone: tenant?.emergency_phone,
      relationship: tenant?.relationship,
    })
    .select()
    .single();

  if (data.error) {
    console.error("Error making tenant:", data.error.message);
    return { data: null, error: data.error };
  }

  return data;
}

export async function updateAcceptedApartment(apt_id) {
  const { data, error } = await supabase
    .from("property_apartments")
    .update({ status: "occupied" })
    .eq("id", apt_id)
    .select();

  if (error) return error;

  return data;
}

export async function updateUser(tenant) {
  const { data, error } = await supabase
    .from("users")
    .update({ tenant_id: tenant?.id })
    .eq("id", tenant?.user_id)
    .select();

  if (error) {
    console.error("Error updating user apartment Id:", error);
    return error;
  }
  return data;
}

export async function apartmentUserDetails(userId) {
  const { data, error } = await supabase
    .from("tenants")
    .select(
      `
      id,
      lease_start_date,
      lease_end_date,
      property_apartments (
        id,
        unit,
        unitImages,
        monthly_rent,
        properties (
          property_name,
          property_type
        )
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching tenant details:", error);
    return error;
  }
  return data;
}

export async function tenantFullDetails(tenantId) {
  const { data, error } = await supabase
    .from("tenants")
    .select(
      `
      id,
      lease_start_date,
      lease_end_date,
      emergency_name,
      emergency_phone,
      relationship,
      users!tenants_user_id_fkey(
        name,
        email, 
        user_number
      ),
      property_apartments (
        id,
        unit,
        unitImages,
        monthly_rent,
        properties (
          property_name,
          property_type
        )
      )
    `
    )
    .eq("id",tenantId);

  if (error) {
    console.error("Error fetching tenant details:", error);
    return error;
  }
  return data;
}



/**
 * Update tenant and associated user details
 * @param {number} tenantId - The ID of the tenant to update
 * @param {Object} userData - User details to update
 * @param {string} [userData.name] - User's name
 * @param {string} [userData.email] - User's email
 * @param {number} [userData.user_number] - User's number
 * @param {Object} tenantData - Tenant details to update
 * @param {string} [tenantData.emergency_name] - Emergency contact name
 * @param {string} [tenantData.emergency_phone] - Emergency contact phone
 * @param {string} [tenantData.relationship] - Relationship to emergency contact
 * @returns {Promise<Object>} Updated tenant and user details
 */
export async function updateTenantDetails(tenantId, userData, tenantData) {
  try {
    // Validate input
    if (!tenantId) {
      throw new Error('Tenant ID is required');
    }

    // Prepare tenant update data
    const tenantUpdateData = {
      emergency_name: tenantData?.emergency_name,
      emergency_phone: tenantData?.emergency_phone,
      relationship: tenantData?.relationship,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(tenantUpdateData).forEach(key => 
      tenantUpdateData[key] === undefined && delete tenantUpdateData[key]
    );

   
    // Update tenant details
    const { data: tenantUpdateResult, error: tenantUpdateError } = await supabase
      .from('tenants')
      .update(tenantUpdateData)
      .eq('id', tenantId)
      .select();

    if (tenantUpdateError) {
      console.error('Error updating tenant details:', tenantUpdateError);
      throw tenantUpdateError;
    }

    // Find the user_id associated with this tenant
    const { data: tenantUser, error: userFetchError } = await supabase
      .from('tenants')
      .select('user_id')
      .eq('id', tenantId)
      .single();

    if (userFetchError) {
      console.error('Error finding user associated with tenant:', userFetchError);
      throw userFetchError;
    }

    // Prepare user update data
    const userUpdateData = {
      name: userData?.name,
      email: userData?.email,
      user_number: userData?.user_number,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(userUpdateData).forEach(key => 
      userUpdateData[key] === undefined && delete userUpdateData[key]
    );

    // Update user details
    const { data: userUpdateResult, error: userUpdateError } = await supabase
      .from('users')
      .update(userUpdateData)
      .eq('id', tenantUser.user_id)
      .select();

    if (userUpdateError) {
      console.error('Error updating user details:', userUpdateError);
      throw userUpdateError;
    }

    // Return the updated data
    return {
      tenant: tenantUpdateResult[0],
      user: userUpdateResult[0]
    };

  } catch (error) {
    console.error('Comprehensive update failed:', error);
    throw error;
  }
}



