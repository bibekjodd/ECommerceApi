"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialConfig = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const zod_1 = require("zod");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const envVariables = zod_1.z.object({
    MONGO_URI: zod_1.z.string().min(1),
    NODE_ENV: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(1),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1),
    CLOUDINARY_API_CLOUD_NAME: zod_1.z.string().min(1),
    SMTP_PASS: zod_1.z.string().min(1),
    SMTP_SERVICE: zod_1.z.string().min(1),
    SMTP_MAIL: zod_1.z.string().min(1),
});
const dotenv_1 = __importDefault(require("dotenv"));
global.envLoaded = false;
// configuration for environment variables
const envConfig = () => {
    if (process.env.NODE_ENV !== "production") {
        dotenv_1.default.config({
            path: ".env",
        });
    }
    try {
        envVariables.parse(process.env);
        global.envLoaded = true;
    }
    catch (error) {
        console.log("Env variables are not loaded".red);
        global.envLoaded = false;
    }
};
const initialConfig = (app) => {
    envConfig();
    cloudinary_1.default.v2.config({
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
    });
    app.all("/", (req, res) => {
        res.json({ message: "Server is running fine" });
    });
    app.all("/api/status", (req, res) => {
        res.status(200).json({
            message: "Server is running",
            envLoaded: global.envLoaded,
            databaseConnected: global.databaseConnected,
        });
    });
    app.use(express_1.default.json({ limit: "0.5mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL.split(" ") }));
    app.use((req, res, next) => {
        if (!global.envLoaded || !global.databaseConnected)
            return res.status(100).json({
                message: "Server configuration error",
            });
        next();
    });
};
exports.initialConfig = initialConfig;
