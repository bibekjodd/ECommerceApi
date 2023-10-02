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

  orderItems: [
    {
      productId: Types.ObjectId;
      price: number;
    }
  ];
  user: Types.ObjectId;
  paidAt: number;
  shippingCost?: number;
  taxCost?: number;
  itemsCost: number;
  discount?: number;
  totalCost: number;
  status: "processing" | "delivered";
  deliveredAt?: number;
}

new Date();
