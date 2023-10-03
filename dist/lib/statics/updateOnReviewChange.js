"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOnReviewChange = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const review_model_1 = __importDefault(require("../../models/review.model"));
const product_model_1 = __importDefault(require("../../models/product.model"));
const updateOnReviewChange = async (productId) => {
    const stats = (await review_model_1.default.aggregate([
        {
            $match: { product: new mongoose_1.default.Types.ObjectId(productId) },
        },
        {
            $group: {
                _id: "$product",
                ratings: { $avg: "$rating" },
                numOfReviews: { $sum: 1 },
            },
        },
    ]));
    if (stats[0]) {
        const { numOfReviews, ratings } = stats[0];
        const product = await product_model_1.default.findById(productId);
        if (product) {
            product.numOfReviews = numOfReviews;
            product.ratings = ratings;
            await product.save();
        }
    }
};
exports.updateOnReviewChange = updateOnReviewChange;
