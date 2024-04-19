import ApiFeatures from '@/lib/api-features';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException
} from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { Notification } from '@/models/notification.model';
import { Product, TProduct } from '@/models/product.model';
import { cascadeOnDeleteProduct } from '@/services/common.service';
import { isValidObjectId } from 'mongoose';

export type CreateProductBody = Partial<TProduct>;
export const createProduct = handleAsync<unknown, unknown, CreateProductBody>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const product = await Product.create({
    ...req.body,
    owner: req.user._id.toString(),
    numOfReviews: 0,
    ratings: 0
  });
  Notification.create({
    user: req.user._id.toString(),
    title: `Product ${product.title} successfully added. The missing features on product can still be added through dashboard.`
  });
  return res.status(201).json({ product, message: 'Product created successfully' });
});

type UpdateProductBody = Partial<TProduct>;
export const updateProduct = handleAsync<{ id: string }, unknown, UpdateProductBody>(
  async (req, res) => {
    if (!req.user) throw new UnauthorizedException();

    const product = await Product.findById(req.params.id);
    if (!product) throw new NotFoundException("Product doesn't exist");
    if (req.user._id.toString() !== product?.owner.toString()) {
      if (req.user.role !== 'admin') {
        throw new ForbiddenException('You must be owner of the product or admin to update product');
      }
    }

    const validUpdateProperties = [
      'title',
      'image',
      'description',
      'price',
      'features',
      'featured',
      'brand',
      'discountRate',
      'sizes',
      'tags',
      'colors',
      'stock'
    ];

    for (const property of validUpdateProperties) {
      // @ts-expect-error assign properties
      product[property] = req.body[property] || product[property];
    }
    await product.updateOne({ ...req.body }, { runValidators: true });
    return res.json({ message: 'Product updated successfully', product });
  }
);

export const deleteProduct = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();

  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (req.user.role !== 'admin' || product?.owner.toString() !== req.user._id.toString()) {
    throw new ForbiddenException('You must be product owner or admin to delete product');
  }
  await Promise.all([product.deleteOne(), cascadeOnDeleteProduct(productId)]);
  Notification.create({
    user: product.owner.toString(),
    title: `Product ${product.title} has removed from the store ${req.user._id.toString() === product.owner.toString() ? 'as per requested' : 'by admin. Contact the admin if it was falsely removed!'}`
  });
  return res.json({ message: 'Product deleted successfully' });
});

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
export const queryProducts = handleAsync<unknown, unknown, unknown, GetProductsQuery>(
  async (req, res) => {
    if (req.query.owner && !isValidObjectId(req.query.owner)) {
      throw new BadRequestException('Invalid owner id provided');
    }
    const apiFeature = new ApiFeatures(
      Product.find().populate('owner', 'name email image'),
      req.query
    );
    apiFeature.runAllQueries();

    const countTotalProducts = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .countTotalProducts();

    const [products, totalProducts] = await Promise.all([apiFeature.result, countTotalProducts]);

    return res.json({
      totalResults: products.length,
      totalProducts,
      products
    });
  }
);

export const getProductDetails = handleAsync<{ id: string }>(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid Product Id' });
  }
  const product = await Product.findById(req.params.id)
    .populate('owner', 'name email image')
    .lean();

  if (!product) throw new NotFoundException("Product with this id doesn't exist");

  return res.json({ product });
});
