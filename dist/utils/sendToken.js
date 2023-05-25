"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * send Cookie Token to the user that expires in 30 days
 */
const sendToken = (user, res, statusCode) => {
    const token = user.generateToken && user.generateToken();
    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 100),
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    };
    user.password = undefined;
    res
        .status(statusCode || 200)
        .cookie("token", token, cookieOptions)
        .json({ user });
};
exports.default = sendToken;
