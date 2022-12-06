// ----- SERVER CONFIGURATION -----
process.env["NODE_CONFIG_DIR"] = "/server/config";
const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey"))
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
};
