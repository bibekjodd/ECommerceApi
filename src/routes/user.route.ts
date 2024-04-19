import { env } from '@/config/env.config';
import {
  deleteProfile,
  forgotPassword,
  getProfile,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile
} from '@/controllers/user.controller';
import { Router } from 'express';
import passport from 'passport';

const router = Router();
export const userRoute = router;

router.post('/register', registerUser);
router.post('/login', passport.authenticate('local'), getProfile);
router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/callback/google', passport.authenticate('google'), (req, res) => {
  res.redirect(env.AUTH_REDIRECT_URI);
});

router.route('/profile').get(getProfile).put(updateProfile).delete(deleteProfile);
router.get('/logout', logout);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.put('/password', updatePassword);
