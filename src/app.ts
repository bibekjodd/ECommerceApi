import express from 'express';
const app = express();
import 'colors';
import { initialConfig } from './config/initial.config';
import { notFound } from './middlewares/notFound';
import { error } from './middlewares/error';
import userRouter from './routes/user.route';
import productRouter from './routes/product.route';
import productReviewRouter from './routes/product.review.route';
import adminRouter from './routes/admin.route';
import adminUserRouter from './routes/admin.user.route';
import adminProductRouter from './routes/admin.product.route';
import devConsole from './lib/devConsole';
import { env } from './config/env.config';

// -------- initial config for api --------
initialConfig(app);

// -------- routes --------
app.use('/api/v1', userRouter);
app.use('/api/v1', productRouter);
app.use('/api/v1', productReviewRouter);
app.use('/api/v1', adminRouter);
app.use('/api/v1', adminUserRouter);
app.use('/api/v1', adminProductRouter);

app.use(notFound);
app.use(error);
const port = env.PORT;
app.listen(port || 5000, () => {
  devConsole(`Server listening at http://localhost:${port || 5000}`.yellow);
});
