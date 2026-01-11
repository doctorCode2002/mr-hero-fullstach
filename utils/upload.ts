/**
 * Utility for uploading images to Cloudinary directly from the browser.
 */

const CLOUDINARY_UPLOAD_PRESET = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const env = (import.meta as any).env || {};
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME;
  const preset = env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
  
  if (!cloudName) {
    console.error('Cloudinary Configuration Error: VITE_CLOUDINARY_CLOUD_NAME is missing from .env');
    throw new Error('Cloudinary Cloud Name is not configured. Please add VITE_CLOUDINARY_CLOUD_NAME to your .env file.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);

  console.log(`Attempting upload to Cloudinary (${cloudName})...`);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cloudinary API Error:', errorData);
      throw new Error(errorData.error?.message || `Cloudinary Error ${response.status}: Failed to upload image.`);
    }

    const data = await response.json();
    console.log('Cloudinary Upload Success:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Critical Upload Error:', error);
    throw error;
  }
};
