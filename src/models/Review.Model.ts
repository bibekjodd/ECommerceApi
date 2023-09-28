import mongoose from "mongoose";
import { IReview } from "../types/reivew";

const reviewSchema = new mongoose.Schema<IReview, mongoose.Model<IReview>>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be not be zero or negative"],
      max: [5, "Rating cant' be more than 5"],
    },
    comment: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

reviewSchema.pre("save", function (next) {
  if (this.rating <= 1) this.rating = 1;
  if (this.rating >= 5) this.rating = 5;

  next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
