import { ForbiddenException, UnauthorizedException } from '@/lib/exceptions';
import { decodeAuthToken } from '@/lib/utils';
import { User } from '@/models/user.model';
import { handleAsync } from './handle-async';

export const isAuthenticatedUser = handleAsync(async (req, res, next) => {
  const unauthorizedException = new UnauthorizedException(
    'Please login to access this resource'
  );
  try {
    const token = req.cookies?.token;
    if (!token) throw unauthorizedException;

    const userId = decodeAuthToken(token);
    if (!userId) throw unauthorizedException;

    const user = await User.findById(userId).select('+password');
    if (!user) throw unauthorizedException;

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    throw unauthorizedException;
  }
});

/**
 * `isAuthenticatedUser` must be used before this.
 */
export const isAdmin = handleAsync(async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new ForbiddenException('Only admin can perform this action'));
  }
  next();
});
