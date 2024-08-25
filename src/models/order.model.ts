import { Model, Schema, Types, model } from 'mongoose';

export type OrderSchema = {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  product: Types.ObjectId;
  user: Types.ObjectId;
  seller: Types.ObjectId;
  address: string;
  status: 'processing' | 'delivered' | 'cancelled';
  paid: boolean;
  paymentType: 'cash-on-delivery' | 'online';
  price: number;
  quantity: number;
  totalPrice: number;
  orderedAt: NativeDate;
  estimatedDeliveryDate: NativeDate;
  deliveredAt: NativeDate | undefined;
  cancelReason?: string;
};

const orderSchema = new Schema<OrderSchema, Model<OrderSchema>>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    address: {
      city: {
        type: String,
        maxlength: [200, 'Too long address']
      },
      country: {
        type: String,
        maxlength: [200, 'Too long address']
      },
      state: {
        type: String,
        maxlength: [200, 'Too long address']
      },
      postalCode: {
        type: String,
        maxlength: [200, 'Too long address']
      }
    },
    deliveredAt: {
      type: Date
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true
    },
    orderedAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    paid: {
      type: Boolean,
      default: false
    },
    paymentType: {
      type: String,
      enum: ['cash-on-delivery', 'online'],
      default: 'cash-on-delivery',
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: [100_000, "Can't place order of more than 100,000 on a single order"]
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: [100_000, "Can't place order of more than 100,000 units on a single order"]
    },
    status: {
      type: String,
      enum: ['processing', 'delivered', 'cancelled'],
      default: 'processing'
    },
    totalPrice: { type: Number, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cancelReason: {
      type: String,
      maxlength: [500, "Cancel remark can't be more than 500 length"]
    }
  },
  { timestamps: true }
);

export const Order = model<OrderSchema, Model<OrderSchema>>('Order', orderSchema);
