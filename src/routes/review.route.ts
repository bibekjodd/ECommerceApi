import {
  createOrUpdateReview,
  deleteProductReview,
  getProductReviews
} from '@/controllers/review.controller';
import { Router } from 'express';

const router = Router();
export const reviewRoute = router;

router.post('/review/:id', createOrUpdateReview);
router.delete('/review/:id', deleteProductReview);
router.get('/reviews/:id', getProductReviews);
