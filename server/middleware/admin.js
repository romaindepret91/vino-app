module.exports = function (req, res, next) {
  if (!req.headers.isadmin) return res.status(403).send("Access denied.");
  next();
};
