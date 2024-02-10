import { updateProductOnReviewChange } from '@/lib/db-actions';
import { ForbiddenException, NotFoundException } from '@/lib/exceptions';
import { decodeUserId } from '@/lib/utils';
import { handleAsync } from '@/middlewares/catch-async-error';
import { Product } from '@/models/product.model';
import { IReview, Review } from '@/models/review.model';

type createOrUpdateReviewBody = Partial<{
  rating: number;
  text: string;
  title: string;
}>;
export const createOrUpdateReview = handleAsync<
  { id: string },
  unknown,
  createOrUpdateReviewBody
>(async (req, res, next) => {
  const productId = req.params.id;
  const { rating, text, title } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new NotFoundException("Product doesn't exist"));
  }

  let review = await Review.findOne({
    product: productId,
    reviewer: req.userId
  });
  let reviewExists = false;

  if (!review) {
    review = await Review.create({
      text,
      rating,
      title,
      product: productId,
      reviewer: req.userId
    });
  } else {
    reviewExists = true;
    if (title) review.title = title;
    if (rating) review.rating = rating;
    if (text) review.text = text;
    await review.save({ validateBeforeSave: true });
  }

  await updateProductOnReviewChange(productId);

  return res.json({
    message: reviewExists ? 'Product Review Updated' : 'Product Reviewed',
    review
  });
});

export const getProductReviews = handleAsync<
  { id: string },
  unknown,
  unknown,
  { page: string }
>(async (req, res) => {
  const productId = req.params.id;
  let page = Number(req.query.page);
  if (isNaN(page) || page < 1) page = 1;
  const skip = (page - 1) * 10;

  let myReview: IReview | null = null;
  const token = req.cookies?.token;
  const userId = decodeUserId(token);
  if (userId && page === 1) {
    myReview = await Review.findOne({
      product: productId,
      reviewer: userId
    })
      .populate('reviewer', 'name email image')
      .lean();
  }

  let reviews = await Review.find({ product: productId })
    .populate('reviewer', 'name email image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .lean();

  if (myReview) {
    reviews = reviews.filter(
      (review) => review._id.toString() !== myReview?._id.toString()
    );
    reviews.unshift(myReview);
  }
  return res.json({ total: reviews.length, reviews });
});

export const deleteProductReview = handleAsync<
  { id: string },
  unknown,
  unknown
>(async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.json(
      "Review already deleted or review with this id doesn't exist"
    );
  }
  if (
    req.userId !== review.reviewer._id.toString() &&
    req.user.role !== 'admin'
  )
    throw new ForbiddenException('Must be reviewer to delete review');

  await review.deleteOne();
  await updateProductOnReviewChange(review?.product.toString());

  return res.json({ message: 'Review deleted successfully' });
});
