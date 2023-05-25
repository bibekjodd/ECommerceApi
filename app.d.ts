import { z } from "zod";
import { envVariables } from "./src/config/appConfig";
export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {
      NODE_ENV: "production" | "development";
    }
  }
  var envLoaded: boolean;
  var databaseConnected: boolean;
}
