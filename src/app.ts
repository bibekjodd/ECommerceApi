import 'colors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import connectDatabase from './config/database';
import { env, validateEnv } from './config/env.config';
import devConsole from './lib/dev-console';
import { NotFoundException } from './lib/exceptions';
import { configureImageUploader } from './lib/image-services';
import { catchAsyncError } from './middlewares/catch-async-error';
import { handleErrorRequest } from './middlewares/handle-error-request';
import adminProductRouter from './routes/admin.product.route';
import adminRouter from './routes/admin.route';
import adminUserRouter from './routes/admin.user.route';
import productRouter from './routes/product.route';
import reviewRoute from './routes/review.route';
import userRouter from './routes/user.route';

export const app = express();
async function bootstrap() {
  // initial configs
  validateEnv();
  connectDatabase();
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: env.FRONTEND_URLS,
      credentials: true
    })
  );
  app.enable('trust proxy');
  configureImageUploader();
  if (env.NODE_ENV === 'development') {
    app.use(morgan('common'));
  }

  app.get('/', (req, res) => {
    return res.json({
      message: 'Server is running fine',
      env: env.NODE_ENV
    });
  });

  app.get(
    '/refresh',
    catchAsyncError(async (req, res) => {
      await connectDatabase();
      return res.json({
        message: 'App refreshed',
        date: new Date().toISOString()
      });
    })
  );

  // -------- routes --------
  app.use('/api', userRouter);
  app.use('/api', productRouter);
  app.use('/api', reviewRoute);
  app.use('/api', adminRouter);
  app.use('/api', adminUserRouter);
  app.use('/api', adminProductRouter);

  app.use(() => {
    throw new NotFoundException();
  });
  app.use(handleErrorRequest);
  if (env.NODE_ENV !== 'test') {
    app.listen(env.PORT, () => {
      devConsole(
        `⚡[Server]: listening at http://localhost:${env.PORT}`.yellow
      );
    });
  }
}
bootstrap();
