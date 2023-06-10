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
  orderby?: string;
  brand?: string;
  featured?: boolean;
  owner?: string;
}

export const getAllProducts = catchAsyncError<unknown, unknown, unknown, Query>(
  async (req, res) => {
    const apiFeature = new ApiFeatures(Product.find(), { ...req.query });

    const invalidOwner = apiFeature.invalidOwner();

    if (invalidOwner) {
      return res.status(200).json({
        totalResults: 0,
        totalProducts: 0,
        products: [],
      });
    }

    apiFeature.search().filter().order().paginate();
    const products = await apiFeature.result;

    const totalProducts = await new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .countTotalProducts();

    return res.status(200).json({
      totalResults: products.length,
      total: totalProducts,
      products,
    });
  }
);
