import { Model, Schema, Types, model } from 'mongoose';

export type IReview = {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  user: Types.ObjectId;
  title?: string;
  rating: number;
  comment?: string;
  product: Types.ObjectId;
};
const reviewSchema = new Schema<IReview, Model<IReview>>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      maxlength: [50, 'Review title must not exceed 50 characters']
    },
    rating: {
      type: Number,
      required: true,
      transform: (value: number) => {
        if (value < 1) return 1;
        if (value > 5) return 5;
        return value;
      }
    },
    comment: {
      type: String,
      maxlength: [200, 'Comment must not exceed 200 characters']
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, "Can't review product without product Id!"]
    }
  },
  { timestamps: true }
);

const Review = model('Review', reviewSchema);
export default Review;
