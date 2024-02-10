import { config } from 'dotenv';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .optional()
      .default('development'),
    MONGO_URI: z.string(),
    MONGO_TEST_URI: z.string().optional(),
    JWT_SECRET: z.string(),
    FRONTEND_URLS: z
      .string()
      .optional()
      .transform((data) => (data || '').split(' ')),

    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    CLOUDINARY_API_CLOUD_NAME: z.string(),

    SMTP_PASS: z.string(),
    SMTP_SERVICE: z.string(),
    SMTP_MAIL: z.string(),

    PORT: z
      .union([z.string(), z.number()])
      .default(5000)
      .transform((port) => {
        port = Number(port) || 5000;
        let indexOfPort = process.argv.indexOf('-p');
        if (indexOfPort === -1) {
          indexOfPort = process.argv.indexOf('--port');
        }
        if (indexOfPort === -1) return port;
        port = Number(process.argv[indexOfPort + 1]) || 5000;
        return port;
      })
  })
  .readonly()
  .refine((env) => {
    if (env.NODE_ENV === 'test' && !env.MONGO_TEST_URI) return false;
    return true;
  }, 'Environment variables configuration failed');

export const validateEnv = () => {
  if (process.env.NODE_ENV !== 'production') {
    config({ path: '.env' });
  }
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.log(`Environment variables validation failed\nExitting app`);
    process.exit(1);
  }
};
export const env = validateEnv();
export type EnvType = z.infer<typeof envSchema>;
