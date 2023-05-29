import mongoose, { MongooseDistinctDocumentMiddleware } from "mongoose";

const productSchema = new mongoose.Schema(
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
    ratings: {
      type: Number,
      default: 0,
    },
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

export interface IProduct
  extends mongoose.Document,
    mongoose.InferSchemaType<typeof productSchema> {
  //
}

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;

export type QueryProduct = ReturnType<typeof Product.find>;
