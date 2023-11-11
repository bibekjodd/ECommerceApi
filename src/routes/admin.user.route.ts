import { Router } from 'express';
import { isAdmin, isAuthenticatedUser } from '../middlewares/auth';
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUserRole
} from '../controllers/admin.user.controller';
const router = Router();
router.use(isAuthenticatedUser, isAdmin);

// ---------------------- Admin User Routes ----------------------
router.route('/admin/users').get(getAllUsers);
router
  .route('/admin/user/:id')
  .get(getSingleUser)
  .put(updateUserRole)
  .delete(deleteUser);
export default router;
