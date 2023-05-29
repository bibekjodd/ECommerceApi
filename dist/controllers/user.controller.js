"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.deleteProfile = exports.logout = exports.getUserDetails = exports.loginUser = exports.registerUser = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const User_Model_1 = __importDefault(require("../models/User.Model"));
const errorHandler_1 = require("../utils/errorHandler");
const cloudinary_1 = __importDefault(require("cloudinary"));
const sendToken_1 = __importStar(require("../utils/sendToken"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * register user api
 * `avatar` must be passed as datauri
 */
exports.registerUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;
    if (!name || !email || !password)
        return next(new errorHandler_1.ErrorHandler("Please enter required fields", 400));
    const userExists = await User_Model_1.default.findOne({ email });
    if (userExists)
        return next(new errorHandler_1.ErrorHandler("User with same email already exists", 400));
    const user = await User_Model_1.default.create({ name, email, password });
    if (avatar) {
        const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
            folder: "MernApi/UserAvatars",
        });
        user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
        await user.save();
    }
    (0, sendToken_1.default)(user, res, 201);
});
/**
 * Login api. Sends the token to user
 */
exports.loginUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new errorHandler_1.ErrorHandler("Please enter required credintials", 400));
    const user = await User_Model_1.default.findOne({ email }).select("+password");
    if (!user)
        return next(new errorHandler_1.ErrorHandler("Invalid user credintials", 400));
    const isMatch = await user.comparePassword(password || "");
    if (!isMatch)
        return next(new errorHandler_1.ErrorHandler("Invalid user credintials", 400));
    (0, sendToken_1.default)(user, res, 200);
});
/**
 * Get My Profile Api
 */
exports.getUserDetails = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    res.status(200).json({ user: req.user });
});
/**
 * logout api
 */
exports.logout = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { maxAge, ...logoutOptions } = sendToken_1.cookieOptions;
    maxAge;
    return res
        .status(200)
        .clearCookie("token", logoutOptions)
        .json({ message: "Logged out successfully" });
});
exports.deleteProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    await req.user.deleteOne();
    return res
        .status(200)
        .json({ message: "Your profile is deleted successfully" });
});
exports.forgotPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email } = req.body;
    if (!email)
        return next(new errorHandler_1.ErrorHandler("Please provide your email", 400));
    const user = await User_Model_1.default.findOne({ email });
    if (!user)
        return next(new errorHandler_1.ErrorHandler("User with this email doesn't exist", 400));
    const token = user.getResetPasswordToken();
    await user.save();
    const subject = "ECommerce Api Password Reset";
    const link = `${process.env.FRONTEND_URL}/resetpassword/${token}`;
    const message = `Click on this link to reset password. <br>
  <a href=${link}>${link}</a>
  `;
    await (0, sendEmail_1.default)({ mail: email, text: message, subject });
    res.status(200).json({ message: "Password Recovery sent to mail" });
});
exports.resetPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const token = req.params.token;
    const resetToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await User_Model_1.default.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
        return next(new errorHandler_1.ErrorHandler("Token is invalid or expired", 400));
    const { password } = req.body;
    if (!password)
        return next(new errorHandler_1.ErrorHandler("Please provide password", 400));
    user.password = password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    (0, sendToken_1.default)(user, res, 200);
});
exports.updatePassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
        return next(new errorHandler_1.ErrorHandler("Please enter required fields", 400));
    const isMatch = await req.user.comparePassword(oldPassword);
    if (!isMatch)
        return next(new errorHandler_1.ErrorHandler("Incorrect old password", 400));
    req.user.password = newPassword;
    await req.user.save();
    res.status(200).json({ message: "Password updated successfully" });
});
exports.updateProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { name, email, avatar } = req.body;
    if (name)
        req.user.name = name;
    if (email)
        req.user.email = email;
    let uploadFailed = false;
    if (avatar) {
        try {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                folder: "MernApi/UserAvatars",
            });
            req.user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        catch (err) {
            //
            uploadFailed = true;
        }
    }
    await req.user.save();
    return res.status(200).json({
        message: `Profile updated successfully ${uploadFailed ? "but avatar could not be updated" : ""}`,
    });
});
