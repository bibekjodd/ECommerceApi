import User from '@/models/user.model';
import { CustomError } from '@/lib/customError';
import { catchAsyncError } from './catchAsyncError';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env.config';

export const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token)
      throw new CustomError('Please login to access this resource', 401);

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    if (!decoded.id)
      throw new CustomError('Please login to access this resource', 401);

    const user = await User.findById(decoded.id).select('+password');
    if (!user)
      throw new CustomError('Please login to access this resource', 401);

    req.user = user;
    next();
  } catch (error) {
    throw new CustomError('Please login to access this resource', 401);
  }
});

/**
 * `isAuthenticatedUser` must be used before this.
 */
export const isAdmin = catchAsyncError(async (req, res, next) => {
  if (req.user?.role !== 'admin')
    throw new CustomError('Only admin can perform this action', 403);

  next();
});
