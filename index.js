import express from "express";
import { config } from "dotenv";

import * as router from "./src/modules/index.js";
import db_connection from "./DB/connection.js";

import { globalMiddleware } from "./src/middlewares/errorController.js";
import { AppError } from "./src/Utils/AppError.js";
import { globalResponse } from "./src/middlewares/error-handling.middleware.js";

config();
db_connection();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  express
    .json
    //   {
    //   limit: "10kb",
    // }
    ()
);

app.use("/api/v1/organizations", router.organizationRouter);
app.use("/api/v1/investors", router.investorRouter);
app.use("/api/v1/companies", router.companyRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`${req.originalUrl} Not found`, 404));
});

// app.use(globalResponse);
app.use(globalMiddleware);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
