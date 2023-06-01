import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
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
});

export interface IReview
  extends mongoose.Document,
    mongoose.InferSchemaType<typeof reviewSchema> {
  //
}

reviewSchema.pre("save", function (next) {
  if (this.rating <= 1) this.rating = 1;
  if (this.rating >= 5) this.rating = 5;

  next();
});

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
