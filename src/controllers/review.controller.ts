import { CustomError } from '@/lib/custom-error';
import { updateProductOnReviewChange } from '@/lib/db-actions';
import { catchAsyncError } from '@/middlewares/catch-async-error';
import Product from '@/models/product.model';
import Review from '@/models/review.model';

type createOrUpdateReviewBody = Partial<{
  rating: number;
  comment: string;
  productId: string;
  title: string;
}>;
export const createOrUpdateReview = catchAsyncError<
  unknown,
  unknown,
  createOrUpdateReviewBody
>(async (req, res, next) => {
  const { rating, comment, productId, title } = req.body;
  if (!productId)
    throw new CustomError('Product id is needed for review!', 400);

  const product = await Product.findById(productId);
  if (!product) {
    return next(new CustomError("Product doesn't exist"));
  }

  let review = await Review.findOne({
    product: productId,
    reviewer: req.user._id.toString()
  });
  let reviewExists = false;

  if (!review) {
    review = await Review.create({
      comment,
      rating,
      title,
      product: productId,
      reviewer: req.user._id.toString()
    });
  } else {
    reviewExists = true;
    if (title) review.title = title;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();
  }

  await updateProductOnReviewChange(productId);

  return res.json({
    message: reviewExists ? 'Product Review Updated' : 'Product Reviewed',
    review
  });
});

export const getProductReviews = catchAsyncError<
  unknown,
  unknown,
  unknown,
  { productId?: string }
>(async (req, res, next) => {
  const { productId } = req.query;
  if (!productId) {
    return next(new CustomError('Please provide product id!'));
  }
  const product = await Product.findById(req.query.productId);
  if (!product) throw new CustomError("Product doesn't exist", 400);

  const reviews = await Review.find({ product: productId }).populate(
    'reviewer',
    'name email avatar'
  );

  return res.json({ total: reviews.length, reviews });
});

export const deleteProductReview = catchAsyncError<
  unknown,
  unknown,
  unknown,
  { reviewId?: string }
>(async (req, res, next) => {
  const { reviewId } = req.query;
  if (!reviewId) {
    return next(new CustomError('Please provide review id!'));
  }
  const review = await Review.findById(reviewId);
  if (!review)
    throw new CustomError(
      `Review already deleted or review with this id doesn't exist`,
      200
    );
  if (
    req.user._id.toString() !== review.reviewer._id.toString() &&
    req.user.role !== 'admin'
  )
    throw new CustomError('Must be reviewer to delete review', 400);

  await review.deleteOne();
  await updateProductOnReviewChange(review?.product.toString());

  return res.json({ message: 'Review deleted successfully' });
});
