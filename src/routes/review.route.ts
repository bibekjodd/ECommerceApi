import {
  createOrUpdateReview,
  deleteProductReview,
  getProductReviews
} from '@/controllers/review.controller';
import { isAuthenticatedUser } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router
  .route('/review')
  .post(isAuthenticatedUser, createOrUpdateReview)
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteProductReview);

export default router;
