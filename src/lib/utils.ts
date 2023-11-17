import { env } from '@/config/env.config';
import type { TUser } from '@/models/user.model';
import type { CookieOptions } from 'express';

export const filterUser = (user: TUser) => {
  user.password = undefined;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  return user;
};

export const cookieOptions: CookieOptions = {
  maxAge: Date.now() + 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: env.NODE_ENV !== 'production' ? false : true,
  sameSite: env.NODE_ENV !== 'production' ? 'lax' : 'none'
};
