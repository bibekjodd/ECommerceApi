"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getSingleUser = exports.getAllUser = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const User_Model_1 = __importDefault(require("../models/User.Model"));
const errorHandler_1 = require("../utils/errorHandler");
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.getAllUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const users = await User_Model_1.default.find();
    res.status(200).json({ total: users.length, users });
});
exports.getSingleUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const user = await User_Model_1.default.findById(req.params.id);
    if (!user)
        return next(new errorHandler_1.ErrorHandler("User with this id doesn't exist", 400));
    return res.status(200).json({ user });
});
exports.updateUserRole = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const user = await User_Model_1.default.findById(req.params.id);
    if (!user)
        return next(new errorHandler_1.ErrorHandler("User with this id doesn't exist", 400));
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();
    res.status(200).json({ message: "User role updated successfully" });
});
exports.deleteUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const user = await User_Model_1.default.findById(req.params.id);
    if (!user)
        return next(new errorHandler_1.ErrorHandler("User deleted successfully", 200));
    const { avatar } = user;
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
    try {
        if (avatar?.url?.includes("res.cloudinary"))
            await cloudinary_1.default.v2.uploader.destroy(avatar?.public_id || "");
    }
    catch (error) {
        //
    }
});
