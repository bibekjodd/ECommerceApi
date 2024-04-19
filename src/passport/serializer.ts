import { User } from '@/models/user.model';
import passport from 'passport';

export const passportSerializer = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
};
