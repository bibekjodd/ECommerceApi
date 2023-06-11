"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductDetails = exports.getAllProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const apiFeatures_1 = __importDefault(require("../lib/apiFeatures"));
const errorHandler_1 = require("../lib/errorHandler");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const Product_Model_1 = __importDefault(require("../models/Product.Model"));
exports.getAllProducts = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const apiFeature = new apiFeatures_1.default(Product_Model_1.default.find(), { ...req.query });
    const invalidOwner = apiFeature.invalidOwner();
    if (invalidOwner) {
        return res.status(200).json({
            totalResults: 0,
            total: 0,
            products: [],
        });
    }
    apiFeature.search().filter().order().paginate();
    const products = await apiFeature.result;
    const totalProducts = await new apiFeatures_1.default(Product_Model_1.default.find(), req.query)
        .search()
        .filter()
        .countTotalProducts();
    return res.status(200).json({
        totalResults: products.length,
        total: totalProducts,
        products,
    });
});
exports.getProductDetails = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    if (!mongoose_1.default.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid Product Id" });
    }
    const product = await Product_Model_1.default.findById(req.params.id)
        .populate("owner")
        .populate("reviews");
    if (!product)
        return next(new errorHandler_1.ErrorHandler("Product with this id doens't exist", 400));
    res.status(200).json({ product });
});
