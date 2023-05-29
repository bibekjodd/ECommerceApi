import { EnvType } from "./src/lib/validateEnv";
import { IUser } from "./src/models/User.Model";
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
      user: IUser;
    }
  }
  var envLoaded: boolean;
  var databaseConnected: boolean;
}
