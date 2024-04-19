import { env } from '@/config/env.config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { CookieOptions } from 'express';
import { SessionOptions } from 'express-session';

export const devConsole = (...args: unknown[]) => {
  if (env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export const cookieOptions: CookieOptions = {
  maxAge: Date.now() + 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: env.NODE_ENV !== 'production' ? false : true,
  sameSite: env.NODE_ENV !== 'production' ? 'lax' : 'none'
};

export const sessionOptions: SessionOptions = {
  resave: false,
  saveUninitialized: false,
  secret: env.SESSION_SECRET,
  proxy: true,
  cookie: cookieOptions
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateResetPasswordToken = (): {
  token: string;
  hashedToken: string;
} => {
  const token = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashedToken };
};
