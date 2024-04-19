import { BadRequestException } from '@/lib/exceptions';
import { verifyPassword } from '@/lib/utils';
import { User } from '@/models/user.model';
import { Strategy } from 'passport-local';

export const LocalStrategy = new Strategy(
  { passwordField: 'password', usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email, isGoogleUser: false }).select('+password');
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      const isMatch = await verifyPassword(password, user.password!);
      if (!isMatch) throw new BadRequestException('Invalid credentials');
      user.password = undefined;
      return done(null, user || undefined);
    } catch (error) {
      return done(error, undefined);
    }
  }
);
