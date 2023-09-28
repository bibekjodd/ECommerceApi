import { Types } from "mongoose";

export interface IReview {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  user: Types.ObjectId;
  title?: string;
  rating: number;
  comment: string;
  product: Types.ObjectId;
}
