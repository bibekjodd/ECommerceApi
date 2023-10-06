import { CustomError } from "../lib/customError";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import Product from "../models/product.model";
import Review from "../models/review.model";
import { createOrUpdateReviewBody } from "../types/review";

export const createOrUpdateReview = catchAsyncError<
  unknown,
  unknown,
  createOrUpdateReviewBody
>(async (req, res) => {
  const { rating, comment, productId, title } = req.body;
  if (!productId) throw new CustomError("Product id is needed for review!");

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

  return res.json({
    message: reviewExists ? "Product Review Updated" : "Product Reviewed",
    review,
  });
});

export const getProductReviews = catchAsyncError<
  unknown,
  unknown,
  unknown,
  { id?: string }
>(async (req, res) => {
  const product = await Product.findById(req.query.id);
  if (!product) throw new CustomError("Product doesn't exist", 400);

  const reviews = await Review.find({ product: req.query.id }).populate(
    "user",
    "name email avatar"
  );

  return res.json({ total: reviews.length, reviews });
});

export const deleteProductReview = catchAsyncError<
  unknown,
  unknown,
  unknown,
  { id?: string }
>(async (req, res) => {
  const review = await Review.findById(req.query.id);
  if (!review) throw new CustomError("Review already deleted", 200);
  if (
    req.user._id.toString() !== review.user._id.toString() &&
    req.user.role !== "admin"
  )
    throw new CustomError("Must be reviewer to delete review", 400);

  await review.deleteOne();
  await Product.updateOnReviewChange(review?.product.toString());

  return res.json({ message: "Review deleted successfully" });
});
