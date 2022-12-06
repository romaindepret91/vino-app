// ----- DATABASE CONNECTION -----
const mongoose = require("mongoose");
const logger = require("../log/logger");

module.exports = function () {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost/vino")
    .then(() => logger.info("Connected to MongoDB database..."));
};
