import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import { env } from './env.config';

export const initialConfig = (app: Express) => {
  cloudinary.v2.config({
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    cloud_name: env.CLOUDINARY_API_CLOUD_NAME
  });

  app.get('/', (req, res) => {
    return res.json({
      message: 'Server is running fine',
      env: env.NODE_ENV
    });
  });

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
};
