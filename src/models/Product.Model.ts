import mongoose from "mongoose";
import { Color, IProduct, Image, ProductStatics } from "../types/product";
import { updateOnReviewChange } from "../lib/statics/updateOnReviewChange";

const productSchema = new mongoose.Schema<IProduct, mongoose.Model<IProduct>>(
  {
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
      transform: (value: string[]) => {
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
      transform: (value: string[]) => {
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
      transform: (value: string[]) => {
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
      transform: (value: string[]) => {
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
      transform: (value: Color[]) => {
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
      transform: (value: Image[]) => {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: true }
);

productSchema.statics.updateOnReviewChange = updateOnReviewChange;

export type TProduct = mongoose.Document & IProduct;

const Product = mongoose.model<
  IProduct,
  mongoose.Model<IProduct> & ProductStatics
>("Product", productSchema);
export default Product;

export type QueryProduct = mongoose.Query<IProduct[], IProduct>;