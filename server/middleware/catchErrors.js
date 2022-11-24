/**
 * Catch errors for a given route handler
 * @param {function} handler route handler async function
 * @returns async function with error handling: passes on the error to the error handler middleware
 */
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
