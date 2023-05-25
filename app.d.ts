import { z } from "zod";
import { envVariables } from "./src/config/appConfig";
import { IUser } from "./src/models/User";
export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {
      NODE_ENV: "production" | "development";
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
