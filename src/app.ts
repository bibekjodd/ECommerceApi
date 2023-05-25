import express from "express";
const app = express();
import "colors";
import { initialConfig } from "./config/appConfig";
import { connectDatabase } from "./config/database";
import mongoose from "mongoose";
import { notFound } from "./middlewares/notFound";
import { error } from "./middlewares/error";

// -------- initial config for api --------
initialConfig(app);

// -------- database configuration --------
connectDatabase();
mongoose.connection.once("open", () => {
  global.databaseConnected = true;
});

mongoose.connection.once("error", () => {
  global.databaseConnected = false;
});

app.use(notFound);
app.use(error);
app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server listening at http://localhost:${process.env.PORT || 5000}`.yellow
  );
});
