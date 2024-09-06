import { getOrderStats, getSalesStats } from '@/controllers/stats.controller';
import { Router } from 'express';

const router = Router();
router.get('/stats/order', getOrderStats);
router.get('/stats/sales', getSalesStats);

export const statsRoute = router;
