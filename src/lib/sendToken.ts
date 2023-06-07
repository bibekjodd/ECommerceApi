import { CookieOptions, Response } from "express";
import { IUser } from "../models/User.Model";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "production" ? false : true,
  sameSite: process.env.NODE_ENV !== "production" ? "lax" : "none",
};

/**
 * sends Cookie Token to the user that expires in 30 days
 */
const sendToken = (
  res: Response,
  user?: Partial<IUser>,
  statusCode?: number,
  logout?: boolean
) => {
  const token = user?.generateToken ? user.generateToken() : "";

  user?.password ? (user.password = undefined) : "";

  res
    .status(statusCode || 200)
    .cookie("token", token, {
      ...cookieOptions,
      expires: new Date(Date.now() + (logout ? 0 : 30 * 24 * 60 * 60 * 1000)),
    })
    .json({
      user: logout ? undefined : user,
      message: logout ? "Logged out successfully" : undefined,
    });
};

export default sendToken;
