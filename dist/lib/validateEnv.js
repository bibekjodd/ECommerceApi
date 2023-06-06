"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const devConsole_1 = __importDefault(require("./devConsole"));
global.envLoaded = false;
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
function validateEnv() {
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
        (0, devConsole_1.default)("Env variables are not loaded".red);
        global.envLoaded = false;
    }
}
exports.default = validateEnv;
