"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticatedUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const customError_1 = require("../lib/customError");
const catchAsyncError_1 = require("./catchAsyncError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.isAuthenticatedUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token)
            throw new customError_1.CustomError("Please login to access this resource", 401);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded.id)
            throw new customError_1.CustomError("Please login to access this resource", 401);
        const user = await user_model_1.default.findById(decoded.id).select("+password");
        if (!user)
            throw new customError_1.CustomError("Please login to access this resource", 401);
        req.user = user;
        next();
    }
    catch (error) {
        throw new customError_1.CustomError("Please login to access this resource", 401);
    }
});
/**
 * `isAuthenticatedUser` must be used before this.
 */
exports.isAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    if (req.user?.role !== "admin")
        throw new customError_1.CustomError("Only admin can perform this action", 403);
    next();
});
