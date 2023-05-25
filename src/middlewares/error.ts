import { ErrorRequestHandler } from "express";

export const error: ErrorRequestHandler = (err, req, res, next) => {
  const message = "Internal Server Error";
  const statusCode = 500;
  res.status(statusCode).json({ message });
};
