import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

import * as router from './src/modules/index.js';
import db_connection from './DB/connection.js';

<<<<<<< HEAD
import { globalMiddleware } from "./src/middlewares/errorController.js";
import { AppError } from "./src/Utils/AppError.js";
import { globalResponse } from "./src/middlewares/error-handling.middleware.js";
import cookieParser from "cookie-parser";
config({ path: "./config.env" });
db_connection();

const app = express();
const port = 3000 || process.env.PORT;
// this middleware so i can read the body of request
app.use(express.json());
// this middleware so i can read or parse the cookies
app.use(cookieParser());
app.use("/api/v1/organizations", router.organizationRouter);
app.use("/api/v1/investors", router.investorRouter);
app.use("/api/v1/companies", router.companyRouter);
app.all("*", (req, res, next) => {
=======
import { globalMiddleware } from './src/middlewares/errorController.js';
import { AppError } from './src/Utils/AppError.js';
import { globalResponse } from './src/middlewares/error-handling.middleware.js';

config({ path: './config.env' });
db_connection();

const app = express();
const port = process.env.PORT || 5000;

// parse req.body
app.use(express.json({ limit: '10kb' }));
// parse cookie
app.use(cookieParser());

app.use('/api/v1/organizations', router.organizationRouter);
app.use('/api/v1/investors', router.investorRouter);
app.use('/api/v1/companies', router.companyRouter);
// app.use(`/api/v1/auth`, router.authRouter);


app.all('*', (req, res, next) => {
>>>>>>> 56f5a82cb68da8f37ce1d757c0d834498815af40
  next(new AppError(`${req.originalUrl} Not found`, 404));
});

// app.use(globalResponse);
app.use(globalMiddleware);

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
