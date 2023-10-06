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
const database_1 = __importDefault(require("./database"));
const initialConfig = (app) => {
    (0, validateEnv_1.default)();
    cloudinary_1.default.v2.config({
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
    });
    mongoose_1.default.connection.once("open", () => {
        global.databaseConnected = true;
    });
    mongoose_1.default.connection.once("error", () => {
        global.databaseConnected = false;
    });
    app.use((0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
        if (mongoose_1.default.ConnectionStates.disconnected ||
            mongoose_1.default.connections.length < 1 ||
            mongoose_1.default.ConnectionStates.uninitialized) {
            await (0, database_1.default)();
        }
        next();
    }));
    app.get("/", (req, res) => {
        return res.json({
            message: "Server is running",
            envLoaded: global.envLoaded,
            databaseConnected: global.databaseConnected,
            NODE_ENV: process.env.NODE_ENV,
            databaseConnections: mongoose_1.default.connections.length,
            FRONTEND_URL: process.env.FRONTEND_URL?.split(" ") || [],
        });
    });
    app.use(express_1.default.json({ limit: "5mb" }));
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
                message: "Server has configuration issues",
            });
        next();
    });
};
exports.initialConfig = initialConfig;
