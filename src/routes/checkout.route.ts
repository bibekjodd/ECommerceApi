import { checkout, webhookListener } from '@/controllers/checkout.controller';
import { Router } from 'express';

const router = Router();
export const checkoutRoute = router;

router.post('/stripe/checkout', checkout);
router.post('/stripe/webhook', webhookListener);
