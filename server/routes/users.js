const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const config = require("config");
const {
  User,
  validateUser,
  validateUserInfo,
  validateUserPassword,
} = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const catchErrors = require("../middleware/catchErrors");

// ----- GET ALL USERS ------
router.get(
  "/",
  [auth, admin],
  catchErrors(async (req, res) => {
    const users = await User.find().sort("name");
    res.send(users);
  })
);

// ----- GET ONE USER ------
router.get(
  "/:id",
  [auth, admin],
  catchErrors(async (req, res) => {
    // Check if id sent is valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid user Id");

    const user = await User.findById(id);
    // Check if user exists
    if (!user) return res.status(404).send("User with given id not found");
    res.send(user);
  })
);

// ----- GET CURRENT USER -----
router.get(
  "/me",
  auth,
  catchErrors(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password"); // req.user contains the _id property inserted in auth middleware. Excludes password.
    res.send(user);
  })
);

// ----- CREATE NEW USER ------
router.post(
  "/",
  catchErrors(async (req, res) => {
    // Data validation
    const result = validateUser(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    // Check if email sent is already used
    let user = await User.findOne({ email: req.body.email });
    if (user) res.status(400).send("This email is already used");

    // Create new user
    user = new User(
      _.pick(req.body, [
        "username",
        "email",
        "password",
        "firstname",
        "surname",
      ]) // Select only the required properties to prevent malicious insertions
    );
    // Hashing password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save user in db
    await user.save();
    res.send(_.pick(user, ["_id", "username", "firstname", "surname"])); // Send back all properties of user object excluding the password
  })
);

// ----- UPDATE USER INFO ------
router.put(
  "/:id",
  auth,
  catchErrors(async (req, res) => {
    //Check if id sent is valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid user Id");

    // Data validation
    const result = validateUserInfo(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    // Check if user exists
    let user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .send("Update failed: user with given id not found");

    // Check if email sent is already used
    let userExists = await User.findOne({ email: req.body.email });
    if (userExists && !userExists._id.equals(user._id))
      return res.status(400).send("This email is already used");

    // Update user
    user = await User.findByIdAndUpdate(
      id,
      {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        surname: req.body.surname,
      },
      { new: true } // returns updated user
    );

    res.send(user);
  })
);

// ----- DELETE ONE USER ------
router.delete(
  "/:id",
  [auth, admin],
  catchErrors(async (req, res) => {
    // Check if id sent is valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid user Id");

    // Check if user exists and delete
    const user = await User.findByIdAndRemove(id);
    if (!user)
      return res
        .status(404)
        .send("Deletion failed: user with given id not found");
    res.send(user);
  })
);

// ----- SEND EMAIL TO USER FOR RESETTING PASSWORD -----
router.get(
  "/:id/passwordReset",
  auth,
  catchErrors(async (req, res) => {
    // Check if id sent is valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid user Id");

    // Check if user exists
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User with given id not found");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: "vinoteam20632@gmail.com",
        pass: config.get("gmailToken"),
      },
      secure: true,
    });
    const tempPassword = Math.random().toString(36).slice(-8);
    // Store temporary password
    await User.findByIdAndUpdate(id, {
      tempPassword: tempPassword,
    });

    const mailData = {
      from: "vinoteam20632@gmail.com",
      to: user.email,
      subject: "Vino - Réinitalisation de mot de passe",
      html: `<h1>Bonjour ${user.username}</h1>,  <a href='http://localhost:3001/dashboard/passwordReset/${tempPassword}'>Cliquez ici pour réinitialiser votre mot de passe</a>`,
    };

    transporter.sendMail(mailData, (err, info) => {
      if (err) return console.log(err);
      res.status(200).send({
        message: `L'email de réinitialisation a bien été envoyé à: ${user.email}`,
        tempPassword: tempPassword,
      });
    });
  })
);

// ----- UPDATE USER PASSWORD ------
router.put(
  "/:id/updatePassword",
  auth,
  catchErrors(async (req, res) => {
    //Check if id sent is valid
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid user Id");

    // Data validation
    const result = validateUserPassword(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);

    // Check if user exists
    let user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .send("Update failed: user with given id not found");

    // Check temporary password
    if (user.tempPassword !== req.body.tempPassword)
      return res.status(401).send("Opération non autorisée");

    // Hashing new password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // Update user password
    user = await User.findByIdAndUpdate(
      id,
      {
        password: req.body.password,
      },
      { new: true } // returns updated user
    );

    res.send(user);
  })
);

module.exports = router;
