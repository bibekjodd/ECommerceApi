"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductReview = exports.getProductReviews = exports.createOrUpdateReview = void 0;
const errorHandler_1 = require("../lib/errorHandler");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const product_model_1 = __importDefault(require("../models/product.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
exports.createOrUpdateReview = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { rating, comment, productId, title } = req.body;
    if (!productId)
        return next(new errorHandler_1.ErrorHandler("Product id is needed for review!"));
    let review = await review_model_1.default.findOne({
        product: productId,
        user: req.user._id.toString(),
    });
    let reviewExists = false;
    if (!review) {
        review = await review_model_1.default.create({
            comment,
            rating,
            title,
            product: productId,
            user: req.user._id.toString(),
        });
    }
    else {
        reviewExists = true;
        if (title)
            review.title = title;
        if (rating)
            review.rating = rating;
        if (comment)
            review.comment = comment;
        await review.save();
    }
    await product_model_1.default.updateOnReviewChange(productId);
    res.status(200).json({
        message: reviewExists ? "Product Review Updated" : "Product Reviewed",
        review,
    });
});
exports.getProductReviews = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const product = await product_model_1.default.findById(req.query.id);
    if (!product)
        return next(new errorHandler_1.ErrorHandler("Product doesn't exist", 400));
    const reviews = await review_model_1.default.find({ product: req.query.id }).populate("user", "name email avatar");
    res.status(200).json({ total: reviews.length, reviews });
});
exports.deleteProductReview = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const review = await review_model_1.default.findById(req.query.id);
    if (!review)
        return next(new errorHandler_1.ErrorHandler("Review already deleted", 200));
    if (req.user._id.toString() !== review.user._id.toString() &&
        req.user.role !== "admin")
        return next(new errorHandler_1.ErrorHandler("Must be reviewer to delete review", 400));
    await review.deleteOne();
    await product_model_1.default.updateOnReviewChange(review?.product.toString());
    res.status(200).json({ message: "Review deleted successfully" });
});
