import { z } from "zod";
import express, { Express } from "express";
import cookieParser from "cookie-parser";

export const envVariables = z.object({
  MONGO_URI: z.string(),
  NODE_ENV: z.string(),
  JWT_SECRET: z.string(),
});

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
    global.envLoaded = false;
  }
};

export const initialConfig = (app: Express) => {
  envConfig();

  app.all("/api/status", (req, res) => {
    res.status(200).json({
      message: "Server is running",
      envLoaded: global.envLoaded,
      databaseConnected: global.databaseConnected,
    });
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use((req, res, next) => {
    if (!global.envLoaded || !global.databaseConnected)
      return res.status(500).json({
        message: "Server configuration error",
      });

    next();
  });
};
