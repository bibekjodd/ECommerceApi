import { Router } from 'express';
import { isAdmin, isAuthenticatedUser } from '@/middlewares/auth';
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUserRole
} from '@/controllers/admin.user.controller';
const router = Router();

// ---------------------- Admin User Routes ----------------------
router.route('/users').get(isAuthenticatedUser, isAdmin, getAllUsers);
router
  .route('/user/:id')
  .get(isAuthenticatedUser, isAdmin, getSingleUser)
  .put(isAuthenticatedUser, isAdmin, updateUserRole)
  .delete(isAuthenticatedUser, isAdmin, deleteUser);
export default router;
