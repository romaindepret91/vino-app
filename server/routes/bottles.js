const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");
const { Bottle, validateBottle } = require("../models/bottle");
const auth = require("../middleware/auth");
const catchErrors = require("../middleware/catchErrors");

// ----- GET ALL BOTTLES -----
router.get(
  "/",
  auth,
  catchErrors(async (req, res, next) => {
    const bottles = await Bottle.find();
    res.send(bottles);
  })
);

// ----- GET ONE BOTTLE -----
router.get(
  "/:id",
  auth,
  catchErrors(async (req, res) => {
    // Check if id sent is valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid bottle Id");

    const bottle = await Bottle.findById(id);
    // Check if bottle exists
    if (!bottle) return res.status(404).send("Bottle with given id not found");
    res.send(bottle);
  })
);

// ----- CREATE NEW BOTTLE -----
router.post(
  "/",
  auth,
  catchErrors(async (req, res) => {
    // Data validation
    const result = validateBottle(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    // Create new bottle
    let bottle = new Bottle(
      _.pick(req.body, [
        "name",
        "type",
        "listed",
        "country",
        "description",
        "saqPrice",
        "saqCode",
        "saqUrl",
        "saqImg",
        "format",
        "alcool",
        "maker",
        "region",
        "millesime",
      ])
    );

    // Save bottle in db
    bottle = await bottle.save();
    res.send(bottle);
  })
);

module.exports = router;
