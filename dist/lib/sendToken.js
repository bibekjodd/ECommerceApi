"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = void 0;
exports.cookieOptions = {
    maxAge: Date.now() + 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production" ? false : true,
    sameSite: process.env.NODE_ENV !== "production" ? "lax" : "none",
};
/**
 * sends Cookie Token to the user that expires in 30 days
 */
const sendToken = (user, res, statusCode) => {
    const token = user.generateToken ? user.generateToken() : "";
    user.password = undefined;
    res
        .status(statusCode || 200)
        .cookie("token", token, exports.cookieOptions)
        .json({ user });
};
exports.default = sendToken;
