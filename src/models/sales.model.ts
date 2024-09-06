import { Document, Model, Schema, Types, model } from 'mongoose';

type SalesSchema = {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  product: Types.ObjectId;
  quantity: number;
  amount: number;
  soldDate: NativeDate;
  deliveryDays: number;
  isCancelled: boolean;
};

const salesSchema = new Schema<SalesSchema, Model<SalesSchema>>(
  {
    deliveryDays: {
      type: Number,
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    isCancelled: {
      type: Boolean,
      default: false
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    soldDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const Sales = model<SalesSchema, Model<SalesSchema>>('Sales', salesSchema);
export type TSale = Document & SalesSchema;
