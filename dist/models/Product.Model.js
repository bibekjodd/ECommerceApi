"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    features: [{ type: String }],
    brand: String,
    discountRate: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    tags: [{ type: String }],
    ram: { type: Number },
    sizes: [{ type: String }],
    colors: [
        {
            code: String,
            value: String,
        },
    ],
    images: [
        {
            public_id: {
                type: String,
                required: [true, "Product image must have public id"],
            },
            url: {
                type: String,
                required: [true, "Product image must have url"],
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"],
    },
    stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Review" }],
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
