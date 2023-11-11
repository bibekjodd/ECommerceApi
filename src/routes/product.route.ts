import { Router } from 'express';
import {
  getAllProducts,
  getProductDetails
} from '../controllers/product.controller';
const router = Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductDetails);

export default router;
