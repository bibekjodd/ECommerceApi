import { CookieOptions, Response } from "express";
import { IUser } from "../models/User";

/**
 * send Cookie Token to the user that expires in 30 days
 */
const sendToken = (
  user: Partial<IUser>,
  res: Response,
  statusCode?: number
) => {
  const token = user.generateToken && user.generateToken();
  const cookieOptions: CookieOptions = {
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

export default sendToken;
