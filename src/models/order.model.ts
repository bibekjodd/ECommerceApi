import { Model, Schema, Types, model } from 'mongoose';

export type IOrder = {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;

  shippingInfo: {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    phoneNo: string;
  };

  orderItems: Types.DocumentArray<{
    productId: Types.ObjectId;
    taxCost?: number;
    discount?: number;
    shippingCost?: number;
    cost: number;
    finalCost: number;
  }>;
  user: Types.ObjectId;
  paidAt: number;
  totalShippingCost?: number;
  totalTaxCost?: number;
  totalItemsCost: number;
  totalDiscount?: number;
  totalCost: number;
  status: 'processing' | 'delivered' | 'cancelled';
  deliveredAt?: number;
};

const orderSchema = new Schema<IOrder, Model<IOrder>>(
  {
    shippingInfo: {
      address: {
        type: String,
        maxlength: 50,
        trim: true,
        required: true
      },
      city: {
        type: String,
        maxlength: 50,
        trim: true,
        required: true
      },
      state: {
        type: String,
        maxlength: 50,
        trim: true,
        required: true
      },
      country: {
        type: String,
        maxlength: 50,
        trim: true,
        required: true
      },
      pinCode: {
        type: String,
        maxlength: 50,
        trim: true,
        required: true
      },
      phoneNo: {
        type: String,
        maxlength: 50,
        trim: true,
        required: true
      }
    },

    orderItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        taxCost: Number,
        discount: Number,
        shippingCost: Number,
        cost: { type: Number, required: true },
        finalCost: { type: Number, required: true }
      }
    ],

    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paidAt: { type: Number, required: true },
    totalShippingCost: Number,
    totalTaxCost: Number,
    totalItemsCost: { type: Number, required: true },
    totalDiscount: Number,
    totalCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ['processing', 'delivered', 'cancelled'],
      default: 'processing',
      required: true
    },
    deliveredAt: Number
  },
  { timestamps: true }
);

export const Order = model('Order', orderSchema);
