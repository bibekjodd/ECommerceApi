"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = void 0;
const apiFeatures_1 = __importDefault(require("../lib/apiFeatures"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const Product_Model_1 = __importDefault(require("../models/Product.Model"));
exports.getAllProducts = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const ApiFeature = new apiFeatures_1.default(Product_Model_1.default.find(), req.query);
    ApiFeature.search().filter().paginate();
    const products = await ApiFeature.result;
    return res.status(200).json({ total: products.length, products });
});
