const mongoose = require("mongoose");
const Joi = require("joi");

const Bottle = mongoose.model(
  "Bottle",
  new mongoose.Schema({
    name: {
      type: String,
      require: true,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    type: {
      type: String,
      require: true,
      trim: true,
      enum: ["rouge", "blanc", "rose"],
    },
    image: {
      type: String,
      require: false,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    listed: {
      type: String,
      require: true,
      trim: true,
      enum: ["Y", "N"],
      default: "Y",
      uppercase: true,
    },
    country: {
      type: String,
      require: false,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    description: {
      type: String,
      require: false,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    saqPrice: {
      type: Number,
      require: false,
      trim: true,
    },
    saqCode: {
      type: String,
      require: false,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    saqUrl: {
      type: String,
      require: false,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    saqImg: {
      type: String,
      require: false,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    format: {
      type: String,
      require: false,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    alcool: {
      type: String,
      require: false,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    maker: {
      type: String,
      require: false,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    region: {
      type: String,
      require: false,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    millesime: {
      type: Number,
      require: false,
      trim: true,
      minlength: 4,
      maxlength: 4,
    },
  })
);

// Data validation
function validateBottle(bottle) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    type: Joi.string().valid("rouge", "blanc", "rose").required(),
    image: Joi.string().min(2).max(255),
    listed: Joi.string(),
    country: Joi.string().min(2).max(255),
    description: Joi.string().min(2).max(255),
    saqPrice: Joi.number().positive().precision(2),
    saqCode: Joi.string().min(2).max(255),
    saqUrl: Joi.string().min(2).max(255),
    saqImg: Joi.string().min(2).max(255),
    format: Joi.string().min(2).max(255),
    alcool: Joi.string().min(2).max(255),
    maker: Joi.string().min(2).max(255),
    region: Joi.string().min(2).max(255),
    millesime: Joi.number().greater(1800).less(2022),
  });
  return schema.validate(bottle);
}

exports.Bottle = Bottle;
exports.validateBottle = validateBottle;
