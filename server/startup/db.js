// ----- DATABASE CONNECTION -----
const mongoose = require("mongoose");
const logger = require("../log/logger");
const config = require("config");

// process.env.MONGODB_URI = `mongodb+srv://romaindepret91:${config.get(
//   "mongoDBToken"
// )}@cluster0.xijvfpu.mongodb.net/vino?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

module.exports = function () {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost/vino")
    .then(() => logger.info("Connected to MongoDB database..."));
};
