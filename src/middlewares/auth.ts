import { env } from '@/config/env.config';
import { ForbiddenException, UnauthorizedException } from '@/lib/exceptions';
import User from '@/models/user.model';
import jwt from 'jsonwebtoken';
import { catchAsyncError } from './catch-async-error';

export const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token)
      throw new UnauthorizedException('Please login to access this resource');

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    if (!decoded.id)
      throw new UnauthorizedException('Please login to access this resource');

    const user = await User.findById(decoded.id).select('+password');
    if (!user)
      throw new UnauthorizedException('Please login to access this resource');

    req.user = user;
    next();
  } catch (error) {
    throw new UnauthorizedException('Please login to access this resource');
  }
});

/**
 * `isAuthenticatedUser` must be used before this.
 */
export const isAdmin = catchAsyncError(async (req, res, next) => {
  if (req.user?.role !== 'admin')
    return next(new ForbiddenException('Only admin can perform this action'));

  next();
});
