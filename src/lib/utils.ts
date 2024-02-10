import { env } from '@/config/env.config';
import type { TUser } from '@/models/user.model';
import type { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';

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

export const decodeUserId = (
  token: string | null | undefined
): string | null => {
  if (!token) return null;
  const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
  if (!decoded?.id) return null;
  return decoded.id;
};

type AuthTokenPayload = { id: string };
export const generateAuthToken = (id: string): string => {
  const payload: AuthTokenPayload = { id };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
  return token;
};

export const decodeAuthToken = (
  token: string | null | undefined
): string | null => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, env.JWT_SECRET) as
      | AuthTokenPayload
      | undefined;
    return decoded?.id || null;
  } catch (err) {
    return null;
  }
};
