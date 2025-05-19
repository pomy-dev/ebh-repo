import { supabase } from '../utils/supabase-client';
import { MaintenanceRequest, FileUploadResult } from '../utils/upload-types';

/**
 * Inserts a new maintenance request into the "maintenance" table.
 */
export async function request_maintenance({
  user_id,
  case_title,
  description,
  files_url = [],
  created_at,
  status = 'pending',
}: {
  user_id: string;
  case_title: string;
  description: string;
  files_url?: [];
  created_at: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}): Promise<MaintenanceRequest> {
  try {
    const imageUrls = files_url.map((file) => file);

    const { data, error } = await supabase
      .from('maintenance')
      .insert({
        user_id,
        case_title,
        description,
        images: imageUrls,
        created_at,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating maintenance request:', error.message);
      throw error;
    }

    console.log('Inserted Maintenance Request:', data);
    return data;
  } catch (error) {
    console.error('Error in request_maintenance:', error);
    throw error;
  }
}

/**
 * Uploads multiple image files to Supabase storage.
 */
export async function uploadMultipleImages(
  files: { uri: string, name: string }[]
): Promise<FileUploadResult[]> {
  try {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map((file) => uploadImage(file.uri, file.name));
    const publicUrls = await Promise.all(uploadPromises);
    return publicUrls;
  } catch (error) {
    console.error('Failed to upload multiple images:', error);
    throw error;
  }
}

/**
 * Uploads a single image file to Supabase storage and returns its public URL.
 */
export async function uploadImage(uri: string, name: any): Promise<FileUploadResult> {
  try {
    // Fetch the file as a Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Determine contentType safely
    const contentType =
      typeof name === "object" && name?.mimeType
        ? name.mimeType
        : "application/octet-stream";

    // Use a valid storage key (filename, not URI)
    const fileName = typeof name === "string" ? name : (name?.name || `image_${Date.now()}.jpg`);
    const filePath = `uploads/${fileName}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("evidence-images")
      .upload(filePath, fileName, {
        cacheControl: "3600",
        upsert: false,
        contentType,
      });

    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    // Retrieve the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("evidence-images")
      .getPublicUrl(uri);

    return {
      url: publicUrlData.publicUrl,
      path: uri,
    };

  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }




  // try {
  //   console.log('Uploading image with URI:', uri);

  //   // Decode URI to handle double-encoding
  //   const decodedUri = decodeURIComponent(uri);
  //   console.log('Decoded URI:', decodedUri);

  //   // Validate file existence
  //   const fileInfo = await FileSystem.getInfoAsync(decodedUri);
  //   if (!fileInfo.exists) {
  //     throw new Error(`File does not exist at URI: ${decodedUri}`);
  //   }

  //   // Copy file to cache with a clean filename to avoid encoding issues
  //   const fileExt = decodedUri.split('.').pop()?.toLowerCase() || 'jpg';
  //   const cleanFileName = `${Date.now()}.${fileExt}`;
  //   const cacheUri = `${FileSystem.cacheDirectory}${cleanFileName}`;
  //   await FileSystem.copyAsync({ from: decodedUri, to: cacheUri });
  //   console.log('Copied file to cache:', cacheUri);

  //   // Read file as binary data
  //   const fileData = await FileSystem.readAsStringAsync(cacheUri, {
  //     encoding: FileSystem.EncodingType.Base64,
  //   });
  //   console.log('File data length (base64):', fileData.length);

  //   // Convert base64 to binary for File object
  //   const binary = atob(fileData);
  //   const array = new Uint8Array(binary.length);
  //   for (let i = 0; i < binary.length; i++) {
  //     array[i] = binary.charCodeAt(i);
  //   }

  //   // Create a File object
  //   const contentType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;
  //   const file = new File([array], cleanFileName, { type: contentType });
  //   console.log('File object created:', { name: file.name, type: file.type, size: file.size });

  //   // Upload File to Supabase
  //   const filePath = `uploads/${cleanFileName}`;
  //   const { error: uploadError } = await supabase.storage
  //     .from('evidence-images')
  //     .upload(filePath, file, {
  //       contentType: contentType,
  //     });

  //   if (uploadError) {
  //     console.error('Error uploading image:', uploadError.message);
  //     throw uploadError;
  //   }

  //   // Retrieve public URL
  //   const { data: publicUrlData } = supabase.storage
  //     .from('evidence-images')
  //     .getPublicUrl(filePath);

  //   if (!publicUrlData || !publicUrlData.publicUrl) {
  //     console.error('Error retrieving public URL for file:', filePath);
  //     throw new Error('Failed to retrieve public URL');
  //   }

  //   // Clean up cached file
  //   await FileSystem.deleteAsync(cacheUri, { idempotent: true });

  //   return {
  //     url: publicUrlData.publicUrl,
  //     path: filePath,
  //   };
  // } catch (error) {
  //   console.error('Error uploading image:', error);
  //   throw error;
  // }
}