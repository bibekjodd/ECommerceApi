import { type RequestHandler } from 'express';

type HandleAsync = <Params = unknown, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>(
  passedFunction: RequestHandler<Params, ResBody, ReqBody, ReqQuery>
) => typeof passedFunction;

export const handleAsync: HandleAsync = (passedFunction) => {
  return (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch((err) => {
      next(err);
    });
  };
};
