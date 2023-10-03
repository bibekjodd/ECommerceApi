import { ErrorHandler } from "../lib/errorHandler";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import Product from "../models/product.model";
import Review from "../models/review.model";
import { createOrUpdateReviewBody } from "../types/review";

export const createOrUpdateReview = catchAsyncError<
  unknown,
  unknown,
  createOrUpdateReviewBody
>(async (req, res, next) => {
  const { rating, comment, productId, title } = req.body;
  if (!productId)
    return next(new ErrorHandler("Product id is needed for review!"));

  let review = await Review.findOne({
    product: productId,
    user: req.user._id.toString(),
  });

  let reviewExists = false;

  if (!review) {
    review = await Review.create({
      comment,
      rating,
      title,
      product: productId,
      user: req.user._id.toString(),
    });
  } else {
    reviewExists = true;
    if (title) review.title = title;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();
  }

  await Product.updateOnReviewChange(productId);

  res.status(200).json({
    message: reviewExists ? "Product Review Updated" : "Product Reviewed",
    review,
  });
});

export const getProductReviews = catchAsyncError<
  unknown,
  unknown,
  unknown,
  { id?: string }
>(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) return next(new ErrorHandler("Product doesn't exist", 400));

  const reviews = await Review.find({ product: req.query.id }).populate(
    "user",
    "name email avatar"
  );

  res.status(200).json({ total: reviews.length, reviews });
});

export const deleteProductReview = catchAsyncError<
  unknown,
  unknown,
  unknown,
  { id?: string }
>(async (req, res, next) => {
  const review = await Review.findById(req.query.id);
  if (!review) return next(new ErrorHandler("Review already deleted", 200));
  if (
    req.user._id.toString() !== review.user._id.toString() &&
    req.user.role !== "admin"
  )
    return next(new ErrorHandler("Must be reviewer to delete review", 400));

  await review.deleteOne();
  await Product.updateOnReviewChange(review?.product.toString());

  res.status(200).json({ message: "Review deleted successfully" });
});
