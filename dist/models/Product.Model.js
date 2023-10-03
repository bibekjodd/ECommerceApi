"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const updateOnReviewChange_1 = require("../lib/statics/updateOnReviewChange");
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
        maxlength: [100, "Too long product title!"],
    },
    description: {
        type: [
            {
                type: String,
                trim: true,
                maxlength: [500, "Too long product description!"],
            },
        ],
        transform: (value) => {
            return value.slice(0, 10);
        },
    },
    price: {
        type: Number,
        required: [true, "Please provide product Price"],
        max: [100000, "Price must not exceed 100000"],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    features: {
        type: [{ type: String, trim: true }],
        transform: (value) => {
            return value.slice(0, 10);
        },
    },
    brand: { type: String, trim: true, lowercase: true },
    discountRate: {
        type: Number,
        max: 100,
        min: 0,
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [{ type: String, trim: true, lowercase: true }],
        transform: (value) => {
            return value.slice(0, 5);
        },
    },
    ram: { type: Number, min: 0 },
    sizes: {
        type: [
            {
                type: String,
                trim: true,
            },
        ],
        transform: (value) => {
            const validSizes = ["sm", "md", "lg", "xl", "2xl"];
            const newSizes = value.filter((size) => validSizes.includes(size));
            return newSizes;
        },
    },
    colors: {
        type: [
            {
                code: { type: String, trim: true },
                value: { type: String, trim: true },
            },
        ],
        transform: (value) => {
            return value.slice(0, 5);
        },
    },
    images: {
        type: [
            {
                public_id: String,
                url: String,
            },
        ],
        transform: (value) => {
            return value.slice(0, 5);
        },
    },
    category: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "Please Enter Product Category"],
    },
    stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        min: [1, "At least 1 stock must be available initially"],
        max: [1000, "Stocks must not exceed 1000 quantities"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
productSchema.statics.updateOnReviewChange = updateOnReviewChange_1.updateOnReviewChange;
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
