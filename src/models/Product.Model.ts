import mongoose from "mongoose";
import { IProduct } from "../types/product";

const productSchema = new mongoose.Schema<IProduct, mongoose.Model<IProduct>>(
  {
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
    tags: [String],
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

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export type TProduct = mongoose.Document & IProduct;

const Product = mongoose.model("Product", productSchema);
export default Product;

export type QueryProduct = mongoose.Query<IProduct[], IProduct>;
