import { env } from '@/config/env.config';
import { User } from '@/models/user.model';
import { Strategy } from 'passport-google-oauth20';

export const GoogleStrategy = new Strategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    passReqToCallback: true,
    callbackURL: env.GOOGLE_CALLBACK_URL
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const name: string = profile.displayName;
      const email: string = profile.emails?.at(0)?.value || '';
      const image: string | undefined = profile.photos?.at(0)?.value;

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ name, email, image, isGoogleUser: true });
      }
      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
);
