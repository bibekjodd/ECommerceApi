import mongoose from "mongoose";
import { IReview } from "../types/review";

const reviewSchema = new mongoose.Schema<IReview, mongoose.Model<IReview>>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
      transform: (value: number) => {
        if (value < 1) return 1;
        if (value > 5) return 5;
        return value;
      },
    },
    comment: {
      type: String,
      maxlength: [200, "Comment must not exceed 200 characters"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
