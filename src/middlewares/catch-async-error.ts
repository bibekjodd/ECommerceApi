import { CustomError } from '@/lib/custom-error';
import { type RequestHandler } from 'express';

type CatchAsyncError = <
  Params = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown
>(
  passedFunction: RequestHandler<Params, ResBody, ReqBody, ReqQuery>,
  options?: { message: string; statusCode?: number }
) => typeof passedFunction;

export const catchAsyncError: CatchAsyncError = (passedFunction, options) => {
  return (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch((err) => {
      if (options?.message) {
        return next(new CustomError(options.message, options.statusCode));
      }
      next(err);
    });
  };
};
