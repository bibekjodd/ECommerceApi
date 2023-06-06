import express from "express";
const app = express();
import "colors";
import { initialConfig } from "./config/appConfig";
import { notFound } from "./middlewares/notFound";
import { error } from "./middlewares/error";
import userRouter from "./routes/user.route";
import productRouter from "./routes/product.route";
import productReviewRouter from "./routes/product.review.route";
import adminRouter from "./routes/admin.route";
import adminUserRouter from "./routes/admin.user.route";
import adminProductRouter from "./routes/admin.product.route";
import connectDatabase from "./config/database";
import devConsole from "./lib/devConsole";

// -------- initial config for api --------
initialConfig(app);

connectDatabase();
// -------- routes --------
app.use("/api/v1", userRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", productReviewRouter);
app.use("/api/v1", adminRouter);
app.use("/api/v1", adminUserRouter);
app.use("/api/v1", adminProductRouter);

app.use(notFound);
app.use(error);
app.listen(process.env.PORT || 5000, () => {
  devConsole(
    `Server listening at http://localhost:${process.env.PORT || 5000}`.yellow
  );
});
