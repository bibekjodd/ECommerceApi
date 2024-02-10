import {
  createProduct,
  deleteProduct,
  getProductDetails,
  queryProducts,
  updateProduct
} from '@/controllers/product.controller';
import { isAuthenticatedUser } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();
export const productRoute = router;

router.post('/product', isAuthenticatedUser, createProduct);
router.get('/products', queryProducts);
router
  .route('/product/:id')
  .get(getProductDetails)
  .delete(isAuthenticatedUser, deleteProduct)
  .put(isAuthenticatedUser, updateProduct);
