const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");
const { Cellar, validateCellar } = require("../models/cellar");
const { User } = require("../models/user");
const { Bottle } = require("../models/bottle");
const auth = require("../middleware/auth");
const catchErrors = require("../middleware/catchErrors");

// ----- GET ALL CELLARS OF USER ------
router.get(
  "/",
  auth,
  catchErrors(async (req, res) => {
    const id = req.query.userId;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid user Id");

    const user = await User.findById(id);
    if (!user) return res.status(400).send("User with given id not found");

    const cellars = await Cellar.find({ userId: id });
    res.send(cellars);
  })
);

// ----- GET ONE CELLAR OF USER ------
router.get(
  "/:id",
  auth,
  catchErrors(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid cellar Id");

    const cellar = await Cellar.findById(id);
    if (!cellar) return res.status(404).send("Cellar with given id not found");
    res.send(cellar);
  })
);

// ----- CREATE NEW CELLAR ------
router.post(
  "/",
  auth,
  catchErrors(async (req, res) => {
    // Data validation
    const result = validateCellar(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    // Check if existing user
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("User with given id not found");

    // Create new cellar
    let cellar = new Cellar(_.pick(req.body, ["name", "bottles", "userId"]));

    // Save cellar in db
    cellar = await cellar.save();
    res.send(cellar);
  })
);

// ----- UPDATE A CELLAR OF USER: UPDATE CELLAR NAME AND BOTTLES IN CELLAR ------
router.put(
  "/:id",
  auth,
  catchErrors(async (req, res) => {
    //Check if cellar id sent is valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid cellar Id");
    // Data validation
    const result = validateCellar(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    // BOTTLES UPDATE
    if (req.body.bottles) {
      // Check if bottle sent exists in db
      const bottleId = req.body.bottles[0]._id;
      const bottle = await Bottle.findById(bottleId);
      if (!bottle)
        return res.status(404).send("Bottle with given id not found");

      // Check if cellar exists
      let cellar = await Cellar.findById(id);
      if (!cellar)
        return res
          .status(404)
          .send("Update failed: cellar with given id not found");

      // Check if bottle already exists in cellar
      const bottleInCellar = cellar.bottles.find(
        (bottle) => bottleId === bottle._id.toString()
      );
      // If bottle does not exist in cellar, push new bottle in list
      if (!bottleInCellar) {
        cellar.bottles.push(req.body.bottles[0]);
        await cellar.save();
      } else {
        // If bottle does exist in cellar, update its quantity and delete bottle if needed
        const deleteBottle = req.query.deleteBottle;
        bottleInCellar.quantity += parseInt(req.body.bottles[0].quantity);
        if (deleteBottle === "true" || bottleInCellar.quantity <= 0) {
          cellar.bottles = cellar.bottles.filter(
            (bottle) => !bottleInCellar._id.equals(bottle._id)
          );
        }
        await cellar.save();
      }
      // Check if user id provided matches records
      if (cellar.userId.toString() != req.body.userId)
        return res
          .status(404)
          .send("Update failed: user id does not match our records");
      res.send(cellar);
    } else {
      // CELLAR NAME UPDATE
      const cellar = await Cellar.findByIdAndUpdate(
        id,
        {
          name: req.body.name,
        },
        { new: true }
      );

      // Check if user id provided matches records
      if (cellar.userId.toString() != req.body.userId)
        return res
          .status(404)
          .send("Update failed: user id does not match our record");
      res.send(cellar);
    }
  })
);

// ----- DELETE A CELLAR OF USER ------
router.delete(
  "/:id",
  auth,
  catchErrors(async (req, res) => {
    //Check if id sent is valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid cellar Id");

    // Check if user exists and delete
    const cellar = await Cellar.findByIdAndRemove(id);
    if (!cellar)
      return res
        .status(404)
        .send("Deletion failed: cellar with given id not found");

    res.send(cellar);
  })
);

module.exports = router;
