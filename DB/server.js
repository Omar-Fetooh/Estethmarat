const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });
const app = require("./app");
const DB = process.env.DATABASE_CONNECTION.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database successfully✅");
  })
  .catch((err) => {
    console.log(err);
  });
let port = 3000 || process.env.PORT;
app.listen(port, "127.0.0.1", () => {
  console.log("server is listening....");
});
