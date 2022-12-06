// ----- SERVER CONFIGURATION -----
const path = require("path");
process.env.NODE_CONFIG_DIR = path.join(__dirname, "..", "config");
const config = require("config");
module.exports = function () {
  if (!config.get("jwtPrivateKey"))
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
};
