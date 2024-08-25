import { Model, Schema, Types, model } from 'mongoose';

export type IReview = {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  reviewer: Types.ObjectId;
  title?: string;
  rating: number;
  text?: string;
  product: Types.ObjectId;
};
const reviewSchema = new Schema<IReview, Model<IReview>>(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      maxlength: [50, 'Review title must not exceed 50 characters'],
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      transform: (value: number) => {
        if (value < 1) return 1;
        if (value > 5) return 5;
        return Math.round(value * 10) / 10;
      }
    },
    text: {
      type: String,
      maxlength: [200, 'Comment must not exceed 200 characters'],
      trim: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, "Can't review product without product Id!"]
    }
  },
  { timestamps: true }
);

export const Review = model('Review', reviewSchema);
