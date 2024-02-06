import ApiFeatures from '@/lib/api-features';
import { NotFoundException } from '@/lib/exceptions';
import { catchAsyncError } from '@/middlewares/catch-async-error';
import Product from '@/models/product.model';
import { isValidObjectId } from 'mongoose';

export type GetProductsQuery = Partial<{
  title: string;

  price_gte: string;
  price_gt: string;
  price_lte: string;
  price_lt: string;

  ratings_gte: string;
  ratings_gt: string;
  ratings_lte: string;
  ratings_lt: string;

  page: string;
  page_size: string;
  category: string;
  offer: 'hotoffers' | 'sales';
  orderby: 'price_asc' | 'price_desc' | 'ratings_asc' | 'ratings_desc';
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
    const product = await Product.findById(req.params.id)
      .populate('owner', 'name email image')
      .lean();

    if (!product)
      throw new NotFoundException("Product with this id doesn't exist");

    return res.json({ product });
  }
);
