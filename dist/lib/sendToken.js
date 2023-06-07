"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptions = void 0;
exports.cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production" ? false : true,
    sameSite: process.env.NODE_ENV !== "production" ? "lax" : "none",
};
/**
 * sends Cookie Token to the user that expires in 30 days
 */
const sendToken = (res, user, statusCode, logout) => {
    const token = user?.generateToken ? user.generateToken() : "";
    user?.password ? (user.password = undefined) : "";
    res
        .status(statusCode || 200)
        .cookie("token", token, {
        ...exports.cookieOptions,
        expires: new Date(Date.now() + (logout ? 0 : 30 * 24 * 60 * 60 * 1000)),
    })
        .json({
        user: logout ? undefined : user,
        message: logout ? "Logged out successfully" : undefined,
    });
};
exports.default = sendToken;
