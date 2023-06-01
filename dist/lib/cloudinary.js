"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = exports.uploadProfilePicture = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const uploadProfilePicture = async (file, folder) => {
    try {
        const { public_id, secure_url } = await cloudinary_1.default.v2.uploader.upload(file, { folder: folder || "ecomapi/avatars" });
        return { public_id, url: secure_url };
    }
    catch (error) {
        return undefined;
    }
};
exports.uploadProfilePicture = uploadProfilePicture;
const uploadImage = async (file, folder) => {
    try {
        const { public_id, secure_url } = await cloudinary_1.default.v2.uploader.upload(file, { folder: folder || "ecomapi/products" });
        return { public_id, url: secure_url };
    }
    catch (error) {
        return undefined;
    }
};
exports.uploadImage = uploadImage;
const deleteImage = async (public_id) => {
    try {
        await cloudinary_1.default.v2.uploader.destroy(public_id);
    }
    catch (error) {
        //
    }
};
exports.deleteImage = deleteImage;
