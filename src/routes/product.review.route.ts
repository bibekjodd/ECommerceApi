import { Router } from 'express';
import { isAuthenticatedUser } from '@/middlewares/auth';
import {
  createOrUpdateReview,
  deleteProductReview,
  getProductReviews
} from '@/controllers/product.review.controller';

const router = Router();

router
  .route('/review')
  .put(isAuthenticatedUser, createOrUpdateReview)
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteProductReview);

export default router;
