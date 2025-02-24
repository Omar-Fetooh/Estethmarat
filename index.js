import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

import * as router from './src/modules/index.js';
import db_connection from './DB/connection.js';

import { globalMiddleware } from './src/middlewares/errorController.js';
import { AppError } from './src/Utils/AppError.js';
import { globalResponse } from './src/middlewares/error-handling.middleware.js';

// config({ path: './config.env' });
config();
db_connection();

const app = express();
const port = process.env.PORT || 5000;

// parse req.body
app.use(express.json({ limit: '10kb' }));
// parse cookie
app.use(cookieParser());

app.use('/api/v1/auth', router.authRouter);
app.use('/api/v1/organizations', router.organizationRouter);
// app.use('/api/v1/investors', router.investorRouter);
app.use('/api/v1/companies', router.companyRouter);
<<<<<<< HEAD
app.use('/api/v1/posts', router.postRouter);
app.use(`/api/v1/auth`, router.authRouter);
app.use('/api/v1/reviews', router.reviewRouter);
app.use('/api/v1/donations', router.donationRouter);
=======
app.use('/api/v1/consultations', router.consultationRouter);
app.use('/api/v1/questions', router.questionRouter);
>>>>>>> 47367c249b182e72b7d48976f3fe8714f75a2007

app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} Not found`, 404));
});

// app.use(globalResponse);
app.use(globalMiddleware);

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
