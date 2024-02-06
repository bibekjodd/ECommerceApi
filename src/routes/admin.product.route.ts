import {
  createProduct,
  deleteProduct,
  updateProduct
} from '@/controllers/admin.product.controller';
import { isAdmin, isAuthenticatedUser } from '@/middlewares/auth';
import express from 'express';

const router = express.Router();

router.route('/product').post(isAuthenticatedUser, createProduct);
router
  .route('/product/:id')
  .put(isAuthenticatedUser, isAdmin, updateProduct)
  .delete(isAuthenticatedUser, isAdmin, deleteProduct);

export default router;
