const logger = require("../log/logger");
/**
 * Handle errors sent by error catcher
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = function (err, req, res, next) {
  logger.error(err.message);
  res.status(500).send("Something failed");
};

// Logging levels:
// error
// warn
// info
// verbose
// debug
// silly
