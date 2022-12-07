const express = require("express");
const app = express();
const logger = require("./log/logger");
const path = require("path");
process.env.NODE_CONFIG_DIR = path.join(__dirname, "..", "server/config");
process.env.MONGODB_URI =
  "mongodb+srv://romaindepret91:MFRQJsCchaDJCh9d@cluster0.xijvfpu.mongodb.net/?retryWrites=true&w=majority";
app.use(express.static(path.join(__dirname + "/public")));

// Calling starting modules
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/dataValidation")();
require("./startup/production")(app); // enable production packages -> helmet + compression

// Listenning to port
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
