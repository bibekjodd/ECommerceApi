"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        maxlength: [50, "Review title must not exceed 50 characters"],
    },
    rating: {
        type: Number,
        required: true,
        min: [1, "Rating must be not be zero or negative"],
        max: [5, "Rating can't be more than 5"],
        transform: (value) => {
            if (value < 1)
                return 1;
            if (value > 5)
                return 5;
            return value;
        },
    },
    comment: {
        type: String,
        maxlength: [200, "Comment must not exceed 200 characters"],
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
    },
}, { timestamps: true });
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
