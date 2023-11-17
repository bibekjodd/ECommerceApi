import {
  getAllProducts,
  getProductDetails
} from '@/controllers/product.controller';
import { Router } from 'express';

const router = Router();

router.get('/products', getAllProducts);
router.get('/product/:id', getProductDetails);

export default router;
