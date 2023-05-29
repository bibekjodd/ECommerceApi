"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
global.databaseConnected = false;
async function connectDatabase() {
    try {
        const { connection } = await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(`Mongodb connected to ${connection.host}`.magenta);
        global.databaseConnected = true;
    }
    catch (err) {
        console.log(`Error occurred while connecting mongodb`.red);
        global.databaseConnected = false;
    }
}
exports.default = connectDatabase;
