import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env' });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'testing']).optional(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  PORT: z.string().optional(),

  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_API_CLOUD_NAME: z.string(),

  SMTP_PASS: z.string(),
  SMTP_SERVICE: z.string(),
  SMTP_MAIL: z.string()
});

export const env = envSchema.parse(process.env);
export type EnvType = z.infer<typeof envSchema>;
