import { Types } from "mongoose";
export interface IProduct {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  title: string;
  description: string;
  price: number;
  featured: boolean;
  features: Types.Array<string>;
  brand?: string;
  discountRate: number;
  ratings: number;
  tags: Types.Array<string>;
  ram?: number;
  sizes: Types.Array<string>;
  colors: Types.DocumentArray<{ code: string; value: string }>;
  images: Types.DocumentArray<{ public_id: string; url: string }>;
  category: string;
  stock: number;
  numOfReviews: number;
  reviews: Types.Array<Types.ObjectId>;
  owner: Types.ObjectId;
}

export interface GetProductsQuery {
  title?: string;
  price: {
    gt?: number;
    gte?: number;
    lte?: number;
    lt?: number;
  };
  ratings: {
    gt?: number;
    gte?: number;
    lte?: number;
    lt?: number;
  };
  page: number;
  pageSize: number;
  category?: string;
  offer?: "hotoffers" | "sales";
  orderby?: string;
  brand?: string;
  featured?: string;
  owner?: string;
}
