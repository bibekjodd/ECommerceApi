import { ErrorRequestHandler } from "express";
import { ErrorHandler } from "../lib/errorHandler";
import mongoose from "mongoose";

export const error: ErrorRequestHandler = (err, req, res, next) => {
  let message = "Internal Server Error";
  let statusCode = 500;

  if (err instanceof ErrorHandler) {
    message = err.message;
    statusCode = err.statusCode || 500;
  }

  if (err instanceof mongoose.MongooseError) {
    if (err.name === "CastError") {
      message = "Invalid Id Provided";
      statusCode = 400;
    }
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : null,
  });
};
