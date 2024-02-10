import { getNotifications } from '@/controllers/notification.controller';
import { isAuthenticatedUser } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();
export const notificationRoute = router;

router.get('/notifications', isAuthenticatedUser, getNotifications);
