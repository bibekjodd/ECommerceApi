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
    let review = await review_model_1.default.findOne({
        product: productId,
        user: req.user._id.toString(),
    });
    let validRating = rating || 0;
    if (validRating <= 1)
        validRating = 1;
    if (validRating >= 5)
        validRating = 5;
    if (!review && !rating)
        return next(new errorHandler_1.ErrorHandler("Please enter required fields", 400));
    let reviewExists = false;
    const product = await product_model_1.default.findById(productId);
    if (!product)
        return next(new errorHandler_1.ErrorHandler("Product doesn't exist", 400));
    if (review) {
        reviewExists = true;
        let totalRatings = product.ratings * product.numOfReviews;
        if (rating) {
            totalRatings = totalRatings - review.rating + validRating;
        }
        product.ratings = totalRatings / product.numOfReviews;
        if (title)
            review.title = title;
        if (comment)
            review.comment = comment;
        if (rating)
            review.rating = validRating;
    }
    else {
        review = await review_model_1.default.create({
            user: req.user._id.toString(),
            product: productId,
            title,
            comment,
            rating,
        });
        const totalRatings = product.ratings * product.reviews.length + validRating;
        product.reviews.push(review._id.toString());
        product.numOfReviews = product.reviews.length;
        product.ratings = totalRatings / product.numOfReviews;
    }
    await product.save();
    await review.save();
    res.status(200).json({
        message: reviewExists ? "Product Review Updated" : "Product Reviewed",
    });
});
exports.getProductReviews = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const product = await product_model_1.default.findById(req.query.id).populate("reviews");
    if (!product)
        return next(new errorHandler_1.ErrorHandler("Product doesn't exist", 400));
    res.status(200).json({ reviews: product.reviews });
});
exports.deleteProductReview = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const review = await review_model_1.default.findById(req.query.id);
    if (!review)
        return next(new errorHandler_1.ErrorHandler("Review already deleted", 200));
    if (req.user._id.toString() !== review.user._id.toString() &&
        req.user.role !== "admin")
        return next(new errorHandler_1.ErrorHandler("Must be reviewer to delete review", 400));
    const product = await product_model_1.default.findById(review.product);
    if (!product)
        return next(new errorHandler_1.ErrorHandler("Review already deleted", 200));
    const totalRatings = product.ratings * product.numOfReviews - review.rating;
    product.reviews = product.reviews.filter((item) => item.toString() !== review._id.toString());
    product.numOfReviews = product.reviews.length;
    product.ratings = totalRatings / (product.numOfReviews || 1);
    await product.save();
    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
});
