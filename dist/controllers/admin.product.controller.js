"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const validateProduct_1 = require("../lib/validateProduct");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const product_model_1 = __importDefault(require("../models/product.model"));
const errorHandler_1 = require("../lib/errorHandler");
const cloudinary_1 = require("../lib/cloudinary");
exports.createProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    (0, validateProduct_1.validateProduct)(req.body);
    const { images, ...productDetails } = req.body;
    let product = new product_model_1.default({
        ...productDetails,
        owner: req.user._id,
    });
    product.features = product.features.slice(0, 10);
    product.tags = product.tags.slice(0, 5);
    switch (product.category) {
        case "mobile":
            break;
        case "laptop":
            break;
        case "electronics":
            break;
        default:
            delete product["ram"];
    }
    product.sizes = product.sizes.filter((size) => {
        return (size === "sm" ||
            size === "md" ||
            size === "lg" ||
            size === "xl" ||
            size === "2xl");
    });
    product.colors = product.colors.slice(0, 7);
    if (images) {
        for (const image of images.slice(0, 5)) {
            const res = await (0, cloudinary_1.uploadImage)(image);
            if (res)
                product.images.push({
                    public_id: res.public_id,
                    url: res.url,
                });
        }
    }
    product = await product.save();
    return res
        .status(201)
        .json({ product, message: "Product created successfully" });
});
exports.updateProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const product = await product_model_1.default.findById(req.params.id);
    if (!product)
        return next(new errorHandler_1.ErrorHandler("Product with this id doesn't exist", 400));
    (0, validateProduct_1.validateUpdateProduct)(req.body);
    const { images, ...productDetails } = req.body;
    for (const key of Object.keys(productDetails)) {
        // @ts-ignore
        product[key] = productDetails[key];
    }
    if (images) {
        let delIndex = 0;
        for (const image of images.add.slice(0, 5)) {
            await (0, cloudinary_1.deleteImage)(product.images[images.indexesToDelete[delIndex]]?.public_id || "");
            const res = await (0, cloudinary_1.uploadImage)(image);
            if (res) {
                product.images[images.indexesToDelete[delIndex]] = {
                    public_id: res.public_id,
                    url: res.url,
                };
            }
        }
        delIndex++;
    }
    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
});
exports.deleteProduct = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    await product_model_1.default.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
});
