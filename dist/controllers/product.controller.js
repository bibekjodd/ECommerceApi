"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const validateProduct_1 = __importDefault(require("../lib/validateProduct"));
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const Product_Model_1 = __importDefault(require("../models/Product.Model"));
const errorHandler_1 = require("../lib/errorHandler");
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.createProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    if (!(0, validateProduct_1.default)(req.body))
        return next(new errorHandler_1.ErrorHandler("Please enter valid data on product field", 400));
    const { images, ...productDetails } = req.body;
    let product = new Product_Model_1.default({
        ...productDetails,
        owner: req.user._id,
    });
    if (images) {
        for (const image of images) {
            const { public_id, secure_url } = await cloudinary_1.default.v2.uploader.upload(image, { folder: "ecomapi/productimage" });
            product.images.push({ public_id, url: secure_url });
        }
    }
    product = await product.save();
    return res
        .status(201)
        .json({ product, message: "Product created successfully" });
});
