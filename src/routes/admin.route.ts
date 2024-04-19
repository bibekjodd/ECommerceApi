import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUserRole
} from '@/controllers/admin.controller';
import { Router } from 'express';
const router = Router();
export const adminRoute = router;

router.route('/users').get(getAllUsers);
router.route('/user/:id').get(getSingleUser).put(updateUserRole).delete(deleteUser);
