"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const error = (err, req, res, next) => {
    let message = "Internal Server Error";
    let statusCode = 500;
    if (err instanceof errorHandler_1.ErrorHandler) {
        message = err.message;
        statusCode = err.statusCode || 500;
    }
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV !== "production" ? err.stack : null,
    });
};
exports.error = error;
