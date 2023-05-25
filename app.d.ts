import { IUser } from "./src/models/User";
import { EnvVariables } from "./src/config/appConfig";
export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariables {
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
