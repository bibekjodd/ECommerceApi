import cloudinary from "cloudinary";
import { z } from "zod";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const envVariables = z.object({
  MONGO_URI: z.string().min(1),
  NODE_ENV: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_API_CLOUD_NAME: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_SERVICE: z.string().min(1),
  SMTP_MAIL: z.string().min(1),
});

export type EnvVariables = z.infer<typeof envVariables>;

import dotenv from "dotenv";
global.envLoaded = false;

// configuration for environment variables
const envConfig = () => {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({
      path: ".env",
    });
  }
  try {
    envVariables.parse(process.env);
    global.envLoaded = true;
  } catch (error) {
    console.log("Env variables are not loaded".red);
    global.envLoaded = false;
  }
};

export const initialConfig = (app: Express) => {
  envConfig();

  cloudinary.v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  });

  app.all("/api/status", (req, res) => {
    res.status(200).json({
      message: "Server is running",
      envLoaded: global.envLoaded,
      databaseConnected: global.databaseConnected,
    });
  });

  app.use(express.json({ limit: "0.5mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors({ origin: process.env.FRONTEND_URL.split(" ") }));

  app.use((req, res, next) => {
    if (!global.envLoaded || !global.databaseConnected)
      return res.status(100).json({
        message: "Server configuration error",
      });

    next();
  });
};
