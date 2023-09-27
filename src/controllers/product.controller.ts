import mongoose from "mongoose";
import ApiFeatures from "../lib/apiFeatures";
import { ErrorHandler } from "../lib/errorHandler";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import Product from "../models/product.model";

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
  featured?: string;
  owner?: string;
}

export const getAllProducts = catchAsyncError<unknown, unknown, unknown, Query>(
  async (req, res) => {
    const apiFeature = new ApiFeatures(Product.find(), { ...req.query });

    const invalidOwner = apiFeature.invalidOwner();

    if (invalidOwner) {
      return res.status(200).json({
        totalResults: 0,
        total: 0,
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

export const getProductDetails = catchAsyncError<{ id: string }>(
  async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product Id" });
    }
    const product = await Product.findById(req.params.id)
      .populate("owner")
      .populate("reviews");

    if (!product)
      return next(new ErrorHandler("Product with this id doens't exist", 400));

    res.status(200).json({ product });
  }
);
