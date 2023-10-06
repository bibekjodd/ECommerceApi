"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductDetails = exports.getAllProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const apiFeatures_1 = __importDefault(require("../lib/apiFeatures"));
const customError_1 = require("../lib/customError");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const product_model_1 = __importDefault(require("../models/product.model"));
exports.getAllProducts = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const apiFeature = new apiFeatures_1.default(product_model_1.default.find(), { ...req.query });
    const invalidOwner = apiFeature.invalidOwner();
    if (invalidOwner) {
        return res.json({
            totalResults: 0,
            total: 0,
            products: [],
        });
    }
    apiFeature.search().filter().order().paginate();
    const products = await apiFeature.result;
    const totalProducts = await new apiFeatures_1.default(product_model_1.default.find(), req.query)
        .search()
        .filter()
        .countTotalProducts();
    return res.json({
        totalResults: products.length,
        total: totalProducts,
        products,
    });
});
exports.getProductDetails = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    if (!mongoose_1.default.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid Product Id" });
    }
    const product = await product_model_1.default.findById(req.params.id)
        .populate("owner")
        .populate("reviews");
    if (!product)
        throw new customError_1.CustomError("Product with this id doens't exist", 400);
    return res.json({ product });
});
