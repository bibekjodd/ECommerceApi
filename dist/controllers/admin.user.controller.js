"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getSingleUser = exports.getAllUsers = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const user_model_1 = __importDefault(require("../models/user.model"));
const customError_1 = require("../lib/customError");
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.getAllUsers = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const users = await user_model_1.default.find();
    return res.json({ total: users.length, users });
});
exports.getSingleUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const user = await user_model_1.default.findById(req.params.id);
    if (!user)
        throw new customError_1.CustomError("User with this id doesn't exist", 400);
    return res.json({ user });
});
exports.updateUserRole = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const user = await user_model_1.default.findById(req.params.id);
    if (!user)
        throw new customError_1.CustomError("User with this id doesn't exist", 400);
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();
    return res.json({ message: "User role updated successfully" });
});
exports.deleteUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const user = await user_model_1.default.findById(req.params.id);
    if (!user)
        throw new customError_1.CustomError("User deleted successfully", 200);
    const { avatar } = user;
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
    try {
        if (avatar?.url?.includes("res.cloudinary"))
            await cloudinary_1.default.v2.uploader.destroy(avatar?.public_id || "");
    }
    catch (error) {
        //
    }
});
