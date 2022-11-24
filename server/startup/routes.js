// ----- MIDDLEWARE ROUTES -----
const express = require("express");
const users = require("../routes/users");
const cellars = require("../routes/cellars");
const bottles = require("../routes/bottles");
const auth = require("../routes/auth");
const handleErrors = require("../middleware/handleErrors");
const cors = require("cors");

module.exports = function (app) {
  // Allow CORS requests
  app.use(cors({ origin: true, credentials: true }));
  // JSON parser middleware
  app.use(express.json());
  // Routes middlewares
  app.use("/api/users", users);
  app.use("/api/cellars", cellars);
  app.use("/api/bottles", bottles);
  app.use("/api/auth", auth);
  // Error handler middleware: called when error catcher catches an error
  app.use(handleErrors);
};
