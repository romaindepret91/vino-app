const mongoose = require("mongoose");
const Joi = require("joi");
const pswdComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

// ----- MODEL USER -----
// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 1024,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  tempPassword: {
    type: String,
    trim: true,
    default: null,
    match: [/^[A-Za-z0-9]{8}$/, "Wrong format"],
  },
});

// Method to generate JSON web token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.jwtPrivateKey
  );
  return token;
};
const User = mongoose.model("User", userSchema);

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

// Data validation for creating user
function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    password: pswdComplexity(complexityOptions).required(),
    password_confirmed: Joi.string().valid(Joi.ref("password")).required(),
    firstname: Joi.string().min(2).max(255).required(),
    surname: Joi.string().min(2).max(255).required(),
  });
  return schema.validate(user);
}

// Data validation for updating user info (not password)
function validateUserInfo(user) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    firstname: Joi.string().min(2).max(255).required(),
    surname: Joi.string().min(2).max(255).required(),
  });
  return schema.validate(user);
}

// Data validation for updating user password
function validateUserPassword(user) {
  const schema = Joi.object({
    password: pswdComplexity(complexityOptions).required(),
    password_confirmed: Joi.string().valid(Joi.ref("password")).required(),
    tempPassword: Joi.string().required(),
  });
  return schema.validate(user);
}

// Exports
exports.User = User;
exports.validateUser = validateUser;
exports.validateUserInfo = validateUserInfo;
exports.validateUserPassword = validateUserPassword;
