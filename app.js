const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const apiRoutes = require("./src/routes/api");

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * = any domain can access
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  ); // * = any domain can access
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // * = any domain can access
  next();
});

app.use("/api", apiRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    const server = app.listen(process.env.PORT);
  })
  .catch(console.log);
