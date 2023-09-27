import { EnvType } from "./src/lib/validateEnv";
import { TUser } from "./src/models/user.model";
export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvType {
      NODE_ENV: "production" | "development";
      FRONTEND_URL: string;
    }
  }
  namespace Express {
    interface Request {
      user: TUser;
    }
  }
  var envLoaded: boolean;
  var databaseConnected: boolean;
}
