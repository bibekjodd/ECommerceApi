import Product from '@/models/product.model';
import Review from '@/models/review.model';
import User from '@/models/user.model';
import { Types } from 'mongoose';
import { deleteImage } from './image-services';

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
      await product.save();
    }
  }
};

export const cascadeOnDeleteUser = async (
  userId: string,
  userAvatarPublicId: string | undefined
) => {
  const delUser = User.findByIdAndDelete(userId);
  const delProducts = Product.deleteMany({ owner: userId });
  const delReviews = Review.deleteMany({ reviewer: userId });
  await Promise.all([
    delUser,
    delProducts,
    delReviews,
    deleteImage(userAvatarPublicId || '')
  ]);
};

export const cascadeOnDeleteProduct = async (productId: string) => {
  const delProduct = Product.findByIdAndDelete(productId);
  const delReviews = Review.deleteMany({ product: productId });
  await Promise.all([delProduct, delReviews]);
};
