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
const user_model_1 = __importDefault(require("../models/user.model"));
const customError_1 = require("../lib/customError");
const sendToken_1 = __importStar(require("../lib/sendToken"));
const sendMail_1 = __importDefault(require("../lib/sendMail"));
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = require("../lib/cloudinary");
/**
 * register user api
 *
 * `avatar` must be passed as datauri
 */
exports.registerUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { name, email, password, avatar } = req.body;
    if (!name || !email || !password)
        throw new customError_1.CustomError("Please Enter the required fields", 400);
    const userExists = await user_model_1.default.findOne({ email });
    if (userExists)
        throw new customError_1.CustomError("User with same email already exists", 400);
    const user = await user_model_1.default.create({ name, email, password });
    if (avatar) {
        const res = await (0, cloudinary_1.uploadImage)(avatar);
        if (res) {
            user.avatar = {
                public_id: res.public_id,
                url: res.url,
            };
        }
        await user.save();
    }
    (0, sendToken_1.default)(user, res, 201);
});
/**
 * Login api. Sends the token to user
 */
exports.loginUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new customError_1.CustomError("Please enter required credintials", 400);
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user)
        throw new customError_1.CustomError("Invalid user credintials", 400);
    const isMatch = await user.comparePassword(password || "");
    if (!isMatch)
        throw new customError_1.CustomError("Invalid user credintials", 400);
    (0, sendToken_1.default)(user, res, 200);
});
/**
 * Get My Profile Api
 */
exports.getUserDetails = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    return res.json({ user: req.user });
});
/**
 * logout api
 */
exports.logout = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    return res
        .status(200)
        .cookie("token", "token", sendToken_1.cookieOptions)
        .json({ message: "Logged out successfully" });
});
exports.deleteProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    await req.user.deleteOne();
    return res
        .status(200)
        .json({ message: "Your profile is deleted successfully" });
});
exports.forgotPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { email } = req.body;
    if (!email)
        throw new customError_1.CustomError("Please provide your email", 400);
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new customError_1.CustomError("User with this email doesn't exist", 400);
    const token = user.getResetPasswordToken();
    await user.save();
    const subject = "ECommerce Api Password Reset";
    const link = `${req.get("origin")}/password/reset/${token}`;
    const message = `Click on this link to reset password. <br>
  <a href=${link}>${link}</a>
  `;
    await (0, sendMail_1.default)({ mail: email, text: message, subject });
    return res.json({ message: "Password Recovery sent to mail", token });
});
exports.resetPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const token = req.params.token;
    const resetToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await user_model_1.default.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
        throw new customError_1.CustomError("Token is invalid or expired", 400);
    const { password } = req.body;
    if (!password)
        throw new customError_1.CustomError("Please provide password", 400);
    user.password = password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    (0, sendToken_1.default)(user, res, 200);
});
exports.updatePassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
        throw new customError_1.CustomError("Please enter required fields", 400);
    const isMatch = await req.user.comparePassword(oldPassword);
    if (!isMatch)
        throw new customError_1.CustomError("Incorrect old password", 400);
    req.user.password = newPassword;
    await req.user.save();
    return res.json({ message: "Password updated successfully" });
});
exports.updateProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { name, email, avatar, password } = req.body;
    if (name)
        req.user.name = name;
    if (email)
        req.user.email = email;
    if (password)
        req.user.password = password;
    let uploadFailed = false;
    if (avatar) {
        try {
            const res = await (0, cloudinary_1.uploadImage)(avatar);
            if (res) {
                req.user.avatar = {
                    public_id: res.public_id,
                    url: res.url,
                };
            }
        }
        catch (err) {
            uploadFailed = true;
        }
    }
    await req.user.save();
    return res.json({
        message: `Profile updated successfully ${uploadFailed ? "but avatar could not be updated" : ""}`,
    });
});
