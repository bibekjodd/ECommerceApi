import { Product } from '@/models/product.model';
import { Review } from '@/models/review.model';
import { Trending } from '@/models/trending.model';
import { Types } from 'mongoose';

export const updateProductOnReviewChange = async (productId: string) => {
  const stats = (await Review.aggregate([
    {
      $match: { product: new Types.ObjectId(productId) }
    },
    {
      $group: {
        _id: '$product',
        ratings: { $avg: '$rating' },
        numOfReviews: { $sum: 1 }
      }
    }
  ])) as { _id: Types.ObjectId; ratings: number; numOfReviews: number }[];

  if (stats[0]) {
    const { numOfReviews, ratings } = stats[0];
    const product = await Product.findById(productId);
    if (product) {
      product.numOfReviews = numOfReviews;
      product.ratings = ratings;
      await product.save({ validateBeforeSave: true });
    }
  } else {
    await Product.findByIdAndUpdate(productId, {
      $set: { numOfReviews: 0, ratings: 0 }
    });
  }
};

export const trendingProducts = async () => {
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  lastWeek.setHours(0);
  lastWeek.setSeconds(0);
  lastWeek.setMilliseconds(0);
  const products = await Trending.aggregate([
    {
      $match: { addedAt: { $gte: lastWeek.toISOString() } }
    },
    {
      $group: {
        _id: '$product',
        count: { $sum: 1 },
        addedAt: { $max: '$addedAt' }
      }
    },
    {
      $sort: {
        count: -1,
        addedAt: -1
      }
    },
    { $limit: 20 },
    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
    { $unwind: '$productDetails' },
    { $replaceRoot: { newRoot: { $mergeObjects: ['$productDetails'] } } }
  ]);
  return products;
};
