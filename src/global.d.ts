import type { EnvType } from './config/env.config';
import { TUser } from './models/user.model';
export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvType {
      //
    }
  }
  namespace Express {
    interface User extends TUser {}
    interface Request {
      user: TUser;
    }
  }
}
