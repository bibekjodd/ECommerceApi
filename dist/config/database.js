"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
global.databaseConnected = false;
const connectDatabase = async () => {
    try {
        const { connection } = await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(`Mongodb connected to ${connection.host}`.magenta);
        global.databaseConnected = true;
    }
    catch (err) {
        console.log(`Error occurred while connecting mongodb`.red);
        global.databaseConnected = false;
    }
};
exports.connectDatabase = connectDatabase;
