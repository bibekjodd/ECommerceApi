import { ErrorRequestHandler } from "express";
import { ErrorHandler } from "../lib/errorHandler";

export const error: ErrorRequestHandler = (err, req, res, next) => {
  let message = "Internal Server Error";
  let statusCode = 500;

  if (err instanceof ErrorHandler) {
    message = err.message;
    statusCode = err.statusCode || 500;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : null,
  });
};
