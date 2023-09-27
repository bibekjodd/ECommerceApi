import { CookieOptions, Response } from "express";
import { TUser } from "../models/user.model";

export const cookieOptions: CookieOptions = {
  maxAge: Date.now() + 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV !== "production" ? false : true,
  sameSite: process.env.NODE_ENV !== "production" ? "lax" : "none",
};

/**
 * sends Cookie Token to the user that expires in 30 days
 */
const sendToken = (
  user: Partial<TUser>,
  res: Response,
  statusCode?: number
) => {
  const token = user.generateToken ? user.generateToken() : "";

  user.password = undefined;

  res
    .status(statusCode || 200)
    .cookie("token", token, cookieOptions)
    .json({ user });
};

export default sendToken;
