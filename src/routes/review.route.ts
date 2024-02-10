import {
  createOrUpdateReview,
  deleteProductReview,
  getProductReviews
} from '@/controllers/review.controller';
import { isAuthenticatedUser } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();
export const reviewRoute = router;

router.post('/review/:id', isAuthenticatedUser, createOrUpdateReview);
router.delete('/review/:id', isAuthenticatedUser, deleteProductReview);
router.get('/reviews/:id', getProductReviews);
