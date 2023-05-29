import { catchAsyncError } from "../middlewares/catchAsyncError";
import Product from "../models/Product.Model";

export const getAllProducts = catchAsyncError(async (req, res) => {
  const products = await Product.find().populate("owner", "name email avatar");

  return res.status(200).json({ total: products.length, products });
});
