import 'colors';
import express from 'express';
import { env } from './config/env.config';
import { initialConfig } from './config/initial.config';
import devConsole from './lib/dev-console';
import { handleErrorRequest } from './middlewares/handle-error-request';
import { notFound } from './middlewares/not-found';
import adminProductRouter from './routes/admin.product.route';
import adminRouter from './routes/admin.route';
import adminUserRouter from './routes/admin.user.route';
import productRouter from './routes/product.route';
import reviewRoute from './routes/review.route';
import userRouter from './routes/user.route';
const app = express();

// -------- initial config for api --------
initialConfig(app);

// -------- routes --------
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', reviewRoute);
app.use('/api', adminRouter);
app.use('/api', adminUserRouter);
app.use('/api', adminProductRouter);

app.use(notFound);
app.use(handleErrorRequest);
const port = env.PORT;
app.listen(port || 5000, () => {
  devConsole(`Server listening at http://localhost:${port || 5000}`.yellow);
});
