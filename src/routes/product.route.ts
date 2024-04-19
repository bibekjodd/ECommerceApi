import {
  createProduct,
  deleteProduct,
  getProductDetails,
  queryProducts,
  updateProduct
} from '@/controllers/product.controller';
import { Router } from 'express';

const router = Router();
export const productRoute = router;

router.post('/product', createProduct);
router.get('/products', queryProducts);
router.route('/product/:id').get(getProductDetails).delete(deleteProduct).put(updateProduct);
