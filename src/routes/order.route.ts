import {
  cancelOrder,
  getMyOrders,
  getOrdersOnMyProducts,
  updateOrder
} from '@/controllers/order.controller';
import { Router } from 'express';

const router = Router();
export const orderRoute = router;

router.put('/order/:id', updateOrder);
router.put('/cancel-order/:id', cancelOrder);

router.get('/my-orders', getMyOrders);
router.get('/orders', getOrdersOnMyProducts);
