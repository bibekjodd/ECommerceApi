"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
const errorHandler_1 = require("../lib/errorHandler");
const mongoose_1 = __importDefault(require("mongoose"));
const error = (err, req, res, next) => {
    let message = "Internal Server Error";
    let statusCode = 500;
    if (err instanceof errorHandler_1.ErrorHandler) {
        message = err.message;
        statusCode = err.statusCode || 500;
    }
    if (err instanceof mongoose_1.default.MongooseError) {
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
exports.error = error;
