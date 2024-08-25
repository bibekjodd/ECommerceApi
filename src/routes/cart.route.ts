import { addToCart, clearCart, getCartItems, removeFromCart } from '@/controllers/cart.controller';
import { Router } from 'express';

const router = Router();
export const cartRoute = router;

router.get('/cart', getCartItems);
router.put('/cart/:id', addToCart);
router.delete('/cart/:id', removeFromCart);
router.delete('/cart', clearCart);
