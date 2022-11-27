const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");
const { Bottle } = require("../models/bottle");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const catchErrors = require("../middleware/catchErrors");

// ----- GET ALL BOTTLES -----
router.get(
  "/bottles",
  [auth, admin],
  catchErrors(async (req, res, next) => {
    let bottlesMap = [];
    const bottles = await Bottle.find();
    bottles.forEach((bottle) => {
      bottlesMap.push({
        id: bottle._id.toString(),
        name: bottle.name,
        saqCode: bottle.saqCode,
        country: bottle.country,
        description: bottle.description,
        saqPrice: bottle.saqPrice,
        format: bottle.format,
        alcool: bottle.alcool,
        maker: bottle.maker,
        region: bottle.region,
        millesime: bottle.millesime,
      });
    });
    res.setHeader("Content-range", "bottles : 0-9/10");
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.send(bottlesMap);
  })
);

// ----- GET ALL USERS ------
router.get(
  "/users",
  [auth, admin],
  catchErrors(async (req, res) => {
    let usersMap = [];
    const users = await User.find().sort("name");
    users.forEach((user) => {
      usersMap.push({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        surname: user.surname,
      });
    });
    res.setHeader("Content-range", "bottles : 0-9/10");
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.send(usersMap);
  })
);

// ----- IMPORT SAQ DATA ------
router.get(
  "/saq",
  [auth, admin],
  catchErrors(async (req, res) => {})
);

module.exports = router;
