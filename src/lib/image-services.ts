import { env } from '@/config/env.config';
import cloudinary from 'cloudinary';

export const configureImageUploader = () => {
  cloudinary.v2.config({
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    cloud_name: env.CLOUDINARY_API_CLOUD_NAME
  });
};

export const uploadProfilePicture = async (file: string, folder?: string) => {
  try {
    const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
      file,
      { folder: folder || 'ecomapi/avatars' }
    );
    return { public_id, url: secure_url };
  } catch (error) {
    return undefined;
  }
};

export const uploadProductImage = async (file: string, folder?: string) => {
  try {
    const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
      file,
      { folder: folder || 'ecomapi/products' }
    );
    return { public_id, url: secure_url };
  } catch (error) {
    return undefined;
  }
};

export const deleteImage = async (public_id: string) => {
  if (!public_id) return;
  try {
    await cloudinary.v2.uploader.destroy(public_id);
  } catch (error) {
    //
  }
};
