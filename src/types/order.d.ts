import { Types } from "mongoose";

export interface IOrder {
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
  status: "processing" | "delivered";
  deliveredAt?: number;
}
