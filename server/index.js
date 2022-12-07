const express = require("express");
const app = express();
const logger = require("./log/logger");
const path = require("path");

// Environement variables
process.env.NODE_CONFIG_DIR = path.join(__dirname, "..", "server/config");

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
