const express = require("express");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const pswdComplexity = require("joi-password-complexity");
const _ = require("lodash");
const { User } = require("../models/user");
const catchErrors = require("../middleware/catchErrors");

// ----- AUTHENTICATE USER ------
router.post(
  "/",
  catchErrors(async (req, res) => {
    // Data validation
    const result = validate(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    // Check if email sent exists in db
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    // Generate JSON web token
    const token = user.generateAuthToken();
    const resBody = {
      access_token: token,
      user: _.pick(user, ["_id", "username", "email", "firstname", "surname"]),
    };

    res.send(resBody);
  })
);

// Password schema
const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 0,
  requirementCount: 5,
};

/**
 * Validate data
 * @param {request} req
 * @returns
 */
function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: pswdComplexity(complexityOptions).required(),
  });
  return schema.validate(req);
}

module.exports = router;
