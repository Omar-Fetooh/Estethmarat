import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

import * as router from './src/modules/index.js';
import db_connection from './DB/connection.js';

import { globalMiddleware } from './src/middlewares/errorController.js';
import { AppError } from './src/Utils/AppError.js';
import { globalResponse } from './src/middlewares/error-handling.middleware.js';
// uncaught exception
process.on('uncaughtException', (err) => {
  console.log('something went wrong🔥', err);
  // server.close(() => {
  //   console.log('Server shut down gracefully!');
  //   process.exit(1);
  // });
});
config({ path: './config.env' });

const DATABASECONNECTIONSTRING = process.env.DATABASE_STR.replace(
  '<db_password>',
  process.env.PASSWORD_DATABASE
);

db_connection(DATABASECONNECTIONSTRING);

const app = express();
const port = process.env.PORT || 5000;
// console.log(DATABASECONNECTIONSTRING);

// parse req.body
app.use(express.json({ limit: '10kb' }));
// parse cookie
app.use(cookieParser());
app.use('/api/v1/auth', router.authRouter);
app.use('/api/v1/organizations', router.organizationRouter);
app.use('/api/v1/investors', router.investorRouter);
app.use('/api/v1/companies', router.companyRouter);

app.use('/api/v1/posts', router.postRouter);
app.use('/api/v1/reviews', router.reviewRouter);
app.use('/api/v1/donations', router.donationRouter);

app.use('/api/v1/consultations', router.consultationRouter);
app.use('/api/v1/questions', router.questionRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} Not found`, 404));
});

// app.use(globalResponse);
app.use(globalMiddleware);

app.get('/', (req, res) => res.send('Hello World!'));
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
// unhandled promised
process.on('unhandledRejection', () => {
  console.log('unhandled promise happened!🔥');
  server.close(() => {
    console.log('Server shut down gracefully!');
    process.exit(0);
  });
});
