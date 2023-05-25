import User from "../models/User";
import { ErrorHandler } from "../utils/errorHandler";
import { catchAsyncError } from "./catchAsyncError";
import jwt from "jsonwebtoken";

/**
 * checks if the user is authenticated or not from
 * `req.cookies.token`
 */
export const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token)
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    if (!decoded?.id)
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );

    const user = await User.findById(decoded.id);
    if (!user)
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
  } catch (error) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  next();
});

/**
 * admin validation middleware
 * `isAuthenticatedUser` must be used before this
 */
export const isAdmin = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin")
    return next(new ErrorHandler("Only admin can perform this action", 403));
  next();
});
