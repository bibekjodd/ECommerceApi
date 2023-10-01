"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumberArray = exports.isStringArray = void 0;
const zod_1 = __importDefault(require("zod"));
const isStringArray = (data) => {
    const schema = zod_1.default.array(zod_1.default.string());
    try {
        schema.parse(data);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.isStringArray = isStringArray;
const isNumberArray = (data) => {
    const schema = zod_1.default.array(zod_1.default.number());
    try {
        schema.parse(data);
        return true;
    }
    catch {
        return false;
    }
};
exports.isNumberArray = isNumberArray;
