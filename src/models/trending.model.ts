import { Document, Model, Schema, Types, model } from 'mongoose';

type TrendingSchema = {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  addedAt: NativeDate;
};

const trendingSchema = new Schema<TrendingSchema, Model<TrendingSchema>>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const Trending = model<TrendingSchema, Model<TrendingSchema>>('trending', trendingSchema);
export type TTrending = Document & TrendingSchema;
