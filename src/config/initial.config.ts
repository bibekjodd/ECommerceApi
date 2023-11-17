import { configureImageUploader } from '@/lib/image-services';
import { catchAsyncError } from '@/middlewares/catch-async-error';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import connectDatabase from './database';
import { env } from './env.config';

export const initialConfig = (app: Express) => {
  connectDatabase();
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: env.FRONTEND_URL?.split(' ') || [],
      credentials: true
    })
  );
  app.enable('trust proxy');
  configureImageUploader();

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
        message: 'Refreshed the app',
        date: new Date().toISOString()
      });
    })
  );

  //
};
