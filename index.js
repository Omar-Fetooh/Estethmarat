import express from "express";
import { config } from "dotenv";

import * as router from "./src/modules/index.js";
import db_connection from "./DB/connection.js";
import { globalResponse } from "./src/middlewares/index.js";

config();
db_connection();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/organization", router.organizationRouter);

app.use(globalResponse);
app.use("*", (req, res, next) => {
  // next({ message: "Not found" });
  res.status(404).json({ message: "Not found" });
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
