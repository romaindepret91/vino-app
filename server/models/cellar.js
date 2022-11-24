const mongoose = require("mongoose");
const Joi = require("joi");

// ----- MODEL CELLAR -----
const Cellar = mongoose.model(
  "Cellar",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 255,
      default: "Nouveau cellier",
    },
    bottles: {
      type: [
        {
          _id: { type: mongoose.Types.ObjectId, ref: "Bottle", require: true },
          quantity: { type: Number, default: 1, min: 1 },
        },
      ],
      default: [],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
  })
);

// Data validation
function validateCellar(cellar) {
  const bottle = Joi.object({
    _id: Joi.objectId().required(),
    quantity: Joi.number().min(-1).required(),
  });
  const schema = Joi.object({
    name: Joi.string().min(2).max(255),
    bottles: Joi.array().items(bottle),
    userId: Joi.objectId().required(),
  });

  return schema.validate(cellar);
}

// Exports
exports.Cellar = Cellar;
exports.validateCellar = validateCellar;
