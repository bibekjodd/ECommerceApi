import mongoose from "mongoose";
import { IOrder } from "../types/order";

const orderSchema = new mongoose.Schema<IOrder, mongoose.Model<IOrder>>(
  {
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

    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        taxCost: Number,
        discount: Number,
        shippingCost: Number,
        cost: { type: Number, required: true },
        finalCost: { type: Number, required: true },
      },
    ],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paidAt: { type: Number, required: true },
    totalShippingCost: Number,
    totalTaxCost: Number,
    totalItemsCost: { type: Number, required: true },
    totalDiscount: Number,
    totalCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ["processing", "delivered"],
      default: "processing",
      required: true,
    },
    deliveredAt: Number,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
