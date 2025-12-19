import { CldUploadWidget, CldImage, CldVideoPlayer } from 'next-cloudinary';

// Types for Cloudinary responses
interface CloudinaryUploadWidgetResults {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    original_filename: string;
    format: string;
    resource_type: string;
    bytes: number;
    width: number;
    height: number;
  };
}

interface UploadOptions {
  folder?: string;
  tags?: string[];
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  eager?: string;
  overwrite?: boolean;
}

/**
 * Upload a file to Cloudinary
 * @param file - File object to upload
 * @param options - Upload options
 * @returns Promise with upload result
 */
export const uploadToCloudinary = async (
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadWidgetResults['info'] | null> => {
  try {
    // Create FormData for the upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

    // Add optional parameters
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    if (options.tags) {
      formData.append('tags', options.tags.join(','));
    }

    if (options.resource_type) {
      formData.append('resource_type', options.resource_type);
    }

    // Make the API request
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cloudinary Upload Error Details:', errorData);
      throw new Error(`Upload failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of File objects to upload
 * @param options - Upload options
 * @returns Promise with array of upload results
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  options: UploadOptions = {}
): Promise<Array<CloudinaryUploadWidgetResults['info'] | null>> => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, options));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error);
    return Array(files.length).fill(null);
  }
};

/**
 * Delete a file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @param resourceType - Type of resource (image, video, raw)
 * @returns Promise with deletion result
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<boolean> => {
  try {
    // For security reasons, deletions should typically be handled server-side
    // This is a client-side implementation for demonstration purposes
    console.warn('Delete operations should be handled server-side for security.');

    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicId,
        resourceType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Delete failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export { CldUploadWidget, CldImage, CldVideoPlayer as CldVideo };