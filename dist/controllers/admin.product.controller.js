"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductDetails = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
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
            try {
                const { public_id, secure_url } = await cloudinary_1.default.v2.uploader.upload(image, { folder: "ecomapi/productimages" });
                product.images.push({ public_id, url: secure_url });
            }
            catch (err) {
                //
            }
        }
    }
    product = await product.save();
    return res
        .status(201)
        .json({ product, message: "Product created successfully" });
});
exports.updateProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const product = await Product_Model_1.default.findById(req.params.id);
    if (!product)
        return next(new errorHandler_1.ErrorHandler("Product with this id doesn't exist", 400));
    const { images, category, price, stock, title, description } = req.body;
    if (category)
        product.category = category;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (title)
        product.title = title;
    if (description)
        product.description = description;
    if (images) {
        for (const image of images) {
            try {
                const { public_id, secure_url } = await cloudinary_1.default.v2.uploader.upload(image, { folder: "ecomapi/productimages" });
                product.images.push({
                    public_id,
                    url: secure_url,
                });
            }
            catch (err) {
                //
            }
        }
    }
    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
});
exports.deleteProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    await Product_Model_1.default.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
});
exports.getProductDetails = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const product = await Product_Model_1.default.findById(req.params.id).populate("owner").populate('reviews');
    if (!product)
        return next(new errorHandler_1.ErrorHandler("Product with this id doens't exist", 400));
    res.status(200).json({ product });
});
