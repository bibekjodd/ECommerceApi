import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUserRole
} from '@/controllers/admin.controller';
import { isAdmin, isAuthenticatedUser } from '@/middlewares/auth';
import { Router } from 'express';
const router = Router();
export const adminRoute = router;

// ---------------------- Admin User Routes ----------------------
router.route('/users').get(isAuthenticatedUser, isAdmin, getAllUsers);
router
  .route('/user/:id')
  .get(isAuthenticatedUser, isAdmin, getSingleUser)
  .put(isAuthenticatedUser, isAdmin, updateUserRole)
  .delete(isAuthenticatedUser, isAdmin, deleteUser);
