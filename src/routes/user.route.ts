import express from 'express';
import {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  deleteProfile
} from '../controllers/user.controller';
import { isAuthenticatedUser } from '../middlewares/auth';

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router
  .route('/me')
  .get(isAuthenticatedUser, getUserDetails)
  .put(isAuthenticatedUser, updateProfile)
  .delete(isAuthenticatedUser, deleteProfile);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

export default router;
