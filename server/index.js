const express = require("express");
const app = express();
const logger = require("./log/logger");

// Calling starting modules
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/dataValidation")();

// Listenning to port
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
