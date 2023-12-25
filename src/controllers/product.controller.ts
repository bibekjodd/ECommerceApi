import ApiFeatures from '@/lib/api-features';
import { CustomError } from '@/lib/custom-error';
import { catchAsyncError } from '@/middlewares/catch-async-error';
import Product from '@/models/product.model';
import Review from '@/models/review.model';
import { isValidObjectId } from 'mongoose';

export type GetProductsQuery = Partial<{
  title: string;
  price: Partial<{
    gt: string;
    gte: string;
    lte: string;
    lt: string;
  }>;
  ratings: Partial<{
    gt: string;
    gte: string;
    lte: string;
    lt: string;
  }>;
  page: string;
  pageSize: string;
  category: string;
  offer: 'hotoffers' | 'sales';
  orderby: string;
  brand: string;
  featured: 'true';
  owner: string;
}>;
export const getAllProducts = catchAsyncError<
  unknown,
  unknown,
  unknown,
  GetProductsQuery
>(async (req, res) => {
  const apiFeature = new ApiFeatures(Product.find(), { ...req.query });

  const invalidOwner = apiFeature.invalidOwner();

  if (invalidOwner) {
    return res.json({
      totalResults: 0,
      totalProducts: 0,
      products: []
    });
  }

  apiFeature.runAllQueries();
  const countTotalProducts = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .countTotalProducts();

  const [products, totalProducts] = await Promise.all([
    apiFeature.result,
    countTotalProducts
  ]);

  return res.json({
    totalResults: products.length,
    totalProducts,
    products
  });
});

export const getProductDetails = catchAsyncError<{ id: string }>(
  async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Product Id' });
    }
    const getProduct = Product.findById(req.params.id)
      .populate('owner', 'name email image')
      .lean();
    const getReview = Review.find({ product: req.params.id })
      .populate('reviewer', 'name email image')
      .limit(10)
      .sort({ createdAt: -1 })
      .lean();

    const [product, reviews] = await Promise.all([getProduct, getReview]);

    if (!product)
      throw new CustomError("Product with this id doesn't exist", 400);

    return res.json({ product: { ...product, reviews } });
  }
);
