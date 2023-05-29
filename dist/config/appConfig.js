"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialConfig = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const validateEnv_1 = __importDefault(require("../lib/validateEnv"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("./database");
const initialConfig = (app) => {
    (0, validateEnv_1.default)();
    cloudinary_1.default.v2.config({
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
    });
    app.use((0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
        if (mongoose_1.default.ConnectionStates.disconnected ||
            mongoose_1.default.connections.length < 1) {
            console.log("attempt");
            await (0, database_1.connectDatabase)();
        }
        next();
    }));
    app.get("/", (req, res) => {
        res.json({
            message: envLoaded && databaseConnected
                ? "Server is running fine"
                : "Server started but might have some error",
        });
    });
    app.get("/api/status", (req, res) => {
        res.status(200).json({
            message: "Server is running",
            envLoaded: global.envLoaded,
            databaseConnected: global.databaseConnected,
            NODE_ENV: process.env.NODE_ENV,
            mongooseConnections: mongoose_1.default.connections.length,
            FRONTEND_URL: process.env.FRONTEND_URL?.split(" ") || [],
        });
    });
    app.use(express_1.default.json({ limit: "0.5mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: process.env.FRONTEND_URL?.split(" ") || [],
        credentials: true,
    }));
    app.enable("trust proxy");
    app.use((req, res, next) => {
        if (!global.envLoaded || !global.databaseConnected)
            return res.status(500).json({
                message: "Server configuration error",
            });
        next();
    });
};
exports.initialConfig = initialConfig;
