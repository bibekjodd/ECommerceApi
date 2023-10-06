import cloudinary from "cloudinary";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import validateEnv from "../lib/validateEnv";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import mongoose from "mongoose";
import connectDatabase from "./database";

export const initialConfig = (app: Express) => {
  validateEnv();

  cloudinary.v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  });

  mongoose.connection.once("open", () => {
    global.databaseConnected = true;
  });

  mongoose.connection.once("error", () => {
    global.databaseConnected = false;
  });

  app.use(
    catchAsyncError(async (req, res, next) => {
      if (
        mongoose.ConnectionStates.disconnected ||
        mongoose.connections.length < 1 ||
        mongoose.ConnectionStates.uninitialized
      ) {
        await connectDatabase();
      }

      next();
    })
  );

  app.get("/", (req, res) => {
    return res.json({
      message: "Server is running",
      envLoaded: global.envLoaded,
      databaseConnected: global.databaseConnected,
      NODE_ENV: process.env.NODE_ENV,
      databaseConnections: mongoose.connections.length,
      FRONTEND_URL: process.env.FRONTEND_URL?.split(" ") || [],
    });
  });

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL?.split(" ") || [],
      credentials: true,
    })
  );
  app.enable("trust proxy");

  app.use((req, res, next) => {
    if (!global.envLoaded || !global.databaseConnected)
      return res.status(500).json({
        message: "Server has configuration issues",
      });

    next();
  });
};
