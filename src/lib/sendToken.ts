import type { CookieOptions, Response } from 'express';
import { type TUser } from '../models/user.model';
import { env } from '../config/env.config';

export const cookieOptions: CookieOptions = {
  maxAge: Date.now() + 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: env.NODE_ENV !== 'production' ? false : true,
  sameSite: env.NODE_ENV !== 'production' ? 'lax' : 'none'
};

/**
 * sends Cookie Token to the user that expires in 30 days
 */
const sendToken = (
  user: Partial<TUser>,
  res: Response,
  statusCode?: number
) => {
  const token = user.generateToken ? user.generateToken() : '';

  user.password = undefined;

  res
    .status(statusCode || 200)
    .cookie('token', token, cookieOptions)
    .json({ user });
};

export default sendToken;
