"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const Product_Model_1 = __importDefault(require("../models/Product.Model"));
exports.getAllProducts = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const products = await Product_Model_1.default.find().populate("owner", "name email avatar");
    return res.status(200).json({ total: products.length, products });
});
