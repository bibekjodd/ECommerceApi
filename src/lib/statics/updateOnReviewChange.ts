import { Types } from 'mongoose';
import Review from '@/models/review.model';
import Product from '@/models/product.model';

export const updateOnReviewChange = async (productId: string) => {
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
      await product.save();
    }
  }
};
