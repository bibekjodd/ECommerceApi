import cloudinary from "cloudinary";

export const uploadProfilePicture = async (file: string, folder?: string) => {
  try {
    const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
      file,
      { folder: folder || "ecomapi/avatars" }
    );
    return { public_id, url: secure_url };
  } catch (error) {
    return undefined;
  }
};

export const uploadImage = async (file: string, folder?: string) => {
  try {
    const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
      file,
      { folder: folder || "ecomapi/products" }
    );
    return { public_id, url: secure_url };
  } catch (error) {
    return undefined;
  }
};

export const deleteImage = async (public_id: string) => {
  try {
    await cloudinary.v2.uploader.destroy(public_id);
  } catch (error) {
    //
  }
};
