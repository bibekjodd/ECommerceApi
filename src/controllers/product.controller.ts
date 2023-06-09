import ApiFeatures from "../lib/apiFeatures";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import Product from "../models/Product.Model";

export interface Query {
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
}

export const getAllProducts = catchAsyncError<unknown, unknown, unknown, Query>(
  async (req, res) => {
    const ApiFeature = new ApiFeatures(Product.find(), req.query);
    ApiFeature.search().filter().paginate();
    const products = await ApiFeature.result;

    return res.status(200).json({ total: products.length, products });
  }
);
