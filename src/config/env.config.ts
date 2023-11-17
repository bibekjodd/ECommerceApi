import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env' });
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'testing'])
    .optional()
    .default('development'),
  MONGO_URI: z.string().readonly(),
  JWT_SECRET: z.string().readonly(),
  FRONTEND_URL: z.string().readonly(),
  PORT: z.string().optional(),

  CLOUDINARY_API_KEY: z.string().readonly(),
  CLOUDINARY_API_SECRET: z.string().readonly(),
  CLOUDINARY_API_CLOUD_NAME: z.string().readonly(),

  SMTP_PASS: z.string().readonly(),
  SMTP_SERVICE: z.string().readonly(),
  SMTP_MAIL: z.string().readonly()
});

export const env = envSchema.parse(process.env);
export type EnvType = z.infer<typeof envSchema>;
