import type { EnvType } from './config/env.config';
import type { TUser } from './models/user.model';
export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvType {
      NODE_ENV: 'production' | 'development';
      FRONTEND_URL: string;
    }
  }
  namespace Express {
    interface Request {
      user: TUser;
      userId: string;
    }
  }
}
