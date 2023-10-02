"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    shippingInfo: {
        address: {
            type: String,
            maxlength: 50,
            trim: true,
            required: true,
        },
        city: {
            type: String,
            maxlength: 50,
            trim: true,
            required: true,
        },
        state: {
            type: String,
            maxlength: 50,
            trim: true,
            required: true,
        },
        country: {
            type: String,
            maxlength: 50,
            trim: true,
            required: true,
        },
        pinCode: {
            type: String,
            maxlength: 50,
            trim: true,
            required: true,
        },
        phoneNo: {
            type: String,
            maxlength: 50,
            trim: true,
            required: true,
        },
    },
    orderItems: {
        type: [
            {
                productId: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    paidAt: { type: Number, required: true },
    shippingCost: Number,
    taxCost: Number,
    itemsCost: { type: Number, required: true },
    discount: Number,
    totalCost: { type: Number, required: true },
    status: { type: String, enum: ["processing", "delivered"] },
    deliveredAt: Number,
}, { timestamps: true });
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
