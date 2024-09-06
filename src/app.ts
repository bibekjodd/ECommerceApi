import 'colors';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import { connectDatabase } from './config/database';
import { env, validateEnv } from './config/env.config';
import { NotFoundException } from './lib/exceptions';
import { devConsole, sessionOptions } from './lib/utils';
import { handleAsync } from './middlewares/handle-async';
import { handleErrorRequest } from './middlewares/handle-error-request';
import { GoogleStrategy } from './passport/google.strategy';
import { LocalStrategy } from './passport/local.strategy';
import { passportSerializer } from './passport/serializer';
import { adminRoute } from './routes/admin.route';
import { cartRoute } from './routes/cart.route';
import { checkoutRoute } from './routes/checkout.route';
import { notificationRoute } from './routes/notification.route';
import { orderRoute } from './routes/order.route';
import { productRoute } from './routes/product.route';
import { reviewRoute } from './routes/review.route';
import { statsRoute } from './routes/stats.route';
import { userRoute } from './routes/user.route';

export const app = express();
validateEnv();
const mongoClientPromise = connectDatabase();
app.use('/api/stripe/webhook', express.text({ type: 'application/json' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.FRONTEND_URLS,
    credentials: true
  })
);
app.enable('trust proxy');
if (env.NODE_ENV === 'development') {
  app.use(morgan('common'));
}

app.use(
  session({ ...sessionOptions, store: new MongoStore({ clientPromise: mongoClientPromise }) })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use('google', GoogleStrategy);
passport.use('local', LocalStrategy);
passportSerializer();

app.get('/', (req, res) => {
  return res.json({
    message: 'Server is running fine',
    env: env.NODE_ENV
  });
});

app.get(
  '/refresh',
  handleAsync(async (req, res) => {
    connectDatabase();
    return res.json({
      message: 'App refreshed',
      date: new Date().toISOString()
    });
  })
);

// -------- routes --------
app.use('/api', userRoute);
app.use('/api', productRoute);
app.use('/api', reviewRoute);
app.use('/api', adminRoute);
app.use('/api', notificationRoute);
app.use('/api', orderRoute);
app.use('/api', cartRoute);
app.use('/api', checkoutRoute);
app.use('/api', statsRoute);

app.use(() => {
  throw new NotFoundException();
});
app.use(handleErrorRequest);
if (env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    devConsole(`⚡[Server]: listening at http://localhost:${env.PORT}`.yellow);
  });
}
export default app;
