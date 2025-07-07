import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import cors from 'cors';
import * as router from './src/modules/index.js';
import db_connection from './DB/connection.js';
import { globalMiddleware } from './src/middlewares/errorController.js';
import { AppError } from './src/Utils/AppError.js';
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

// db_connection('mongodb://localhost:27017/estethmarat');

const app = express();
const port = process.env.PORT || 5000;
console.log(DATABASECONNECTIONSTRING);

app.use(cors());

// parse req.body
app.use(express.json({ limit: '10kb' }));
// parse cookie
app.use(cookieParser());
app.use('/api/v1/updateMyPassword', router.updateMyPasswordRouter);
app.use('/api/v1/settings', router.dataRouter);
app.use('/api/v1/search', router.searchRouter);
app.use('/api/v1/updateMe', router.updateMeRouter);
// app.use('/api/v1/filter', router.searchRouter);

app.use('/api/v1/auth', router.authRouter);
app.use('/api/v1/organizations', router.organizationRouter);
app.use('/api/v1/investors', router.investorRouter);
app.use('/api/v1/companies', router.companyRouter);
app.use('/api/v1/supportOrganizations', router.supportOrganizationRouter);
app.use('/api/v1/charityOrganizations', router.charityOrganizationRouter);

app.use('/api/v1/posts', router.postRouter);
app.use('/api/v1/reviews', router.reviewRouter);
app.use('/api/v1/donations', router.donationRouter);
app.use('/api/v1/deal', router.dealRouter);
app.use('/api/v1/comments', router.commentRouter);

app.use('/api/v1/offers', router.offerRouter);
app.use('/api/v1/recommendations', router.suggestCompanyRouter);
app.use('/api/v1/three-top-companies', router.TopThreeCompanyRouter);
app.use('/api/v1/three-top-investors', router.TopThreeInvestorRouter);
app.use('/api/v1/request-consultaion', router.consultationRouter);
app.use('/api/v1/reply-consultation', router.consultationRouterReplies);
app.use('/api/v1/support-charity', router.getSupportRouter);
app.use('/api/v1/support-incubator', router.getSupportToIncubatorRouter);
app.use('/api/v1/charity-notifications', router.charityNotificationsRouter);
app.use('/api/v1/incubator-notifications', router.incubatorNotificationsRouter);
app.use('/api/v1/admin', router.adminRouter);

app.use(
  '/api/v1/charity-open-notifications',
  router.charityOpenedNotificationsRouter
);
app.use(
  '/api/v1/incubator-open-notifications',
  router.incubatorOpenedNotificationsRouter
);
app.get('/', (req, res) => res.send('Welcome in Estethmarat!'));
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} Not found`, 404));
});

// app.use(globalResponse);
app.use(globalMiddleware);

// unhandled promised
process.on('unhandledRejection', () => {
  console.log('unhandled promise happened!🔥');
  server.close(() => {
    console.log('Server shut down gracefully!');
    process.exit(0);
  });
});
