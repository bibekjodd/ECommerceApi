import { env } from '@/config/env.config';
import { HttpException } from '@/lib/exceptions';
import { ErrorRequestHandler } from 'express';
import { MongooseError } from 'mongoose';
import { ZodError } from 'zod';

export const handleErrorRequest: ErrorRequestHandler = (err, req, res, next) => {
  let message: string = err.message || 'Internal Server Error';
  let statusCode = err.statusCode || 500;
  let stack: string | undefined = undefined;
  if (err instanceof Error) {
    message = err.message || message;
    if (env.NODE_ENV === 'development') {
      stack = err.stack;
    }
  }

  if (err instanceof HttpException) {
    message = err.message;
    statusCode = err.statusCode;
  }

  if (err instanceof ZodError) {
    statusCode = 400;
    const issue = err.issues.at(0);
    if (issue) {
      let zodMessage = `${issue.path}: ${issue.message}`;
      if (zodMessage.startsWith(': ')) {
        zodMessage = zodMessage.slice(2);
      }
      message = zodMessage || message;
    }
  }

  if (err instanceof MongooseError) {
    if (err.name === 'ValidationError') {
      // @ts-expect-error mongoose typescript undefined error property
      message = Object.values(err.errors)?.at(0)?.message || message;
    }
    statusCode = 400;
  }
  return res.status(statusCode).json({ message, stack });
};
