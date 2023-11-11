import express from 'express';
import { isAuthenticatedUser, isAdmin } from '../middlewares/auth';
import {
  createProduct,
  deleteProduct,
  updateProduct
} from '../controllers/admin.product.controller';
import { getProductDetails } from '../controllers/product.controller';

const router = express.Router();
router.use(isAuthenticatedUser, isAdmin);

// ---------------------- Admin Product Routes ----------------------
router.route('/admin/product').post(createProduct);
router
  .route('/admin/product/:id')
  .put(updateProduct)
  .delete(deleteProduct)
  .get(getProductDetails);

export default router;
