import { z } from "zod";
import dotenv from "dotenv";
import devConsole from "./devConsole";

export type EnvType = z.infer<typeof envVariables>;
global.envLoaded = false;

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

export default function validateEnv() {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({
      path: ".env",
    });
  }
  try {
    envVariables.parse(process.env);
    global.envLoaded = true;
  } catch (error) {
    devConsole("Env variables are not loaded".red);
    global.envLoaded = false;
  }
}
