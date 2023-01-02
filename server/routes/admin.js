const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Bottle } = require("../models/bottle");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const catchErrors = require("../middleware/catchErrors");
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
    res.setHeader("Content-range", `bottles : 0-9/${bottles.length}`);
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
    res.setHeader("Content-range", "users : 0-9/10");
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.send(usersMap);
  })
);

// ----- IMPORT SAQ DATA ------
router.get(
  "/saq",
  [auth, admin],
  catchErrors(async (req, res) => {
    let bottlesToReturn = [];
    let bottlesInserted = 0;
    let bottlesRejected = 0;
    let mainPageHtml = await axios("https://www.saq.com/fr/produits/vin");
    mainPageHtml = mainPageHtml.data;
    const mainDom = new JSDOM(mainPageHtml);
    const totalBottles = parseInt(
      mainDom.window.document.querySelector("#toolbar-amount").lastElementChild
        .innerHTML
    );
    // Number of loops required to go through every pages (24 bottles per page)
    // const pages = Math.ceil(totalBottles / 24);
    const pages = 20;
    // Loop though wine pages
    for (let i = 1; i <= pages; i++) {
      let html = await axios.get(`https://www.saq.com/fr/produits/vin?p=${i}`);

      // Retrieve all saq codes from page
      html = html.data;
      const dom = new JSDOM(html);
      const saqCodes = Array.from(
        dom.window.document.querySelectorAll(".saq-code")
      );

      // call to wine page for each wine
      await Promise.all(
        saqCodes.map(async (code) => {
          const saqCode = code.lastElementChild.innerHTML;
          let winePageHtml = await axios.get(
            `https://www.saq.com/fr/${saqCode}`
          );
          winePageHtml = winePageHtml.data;
          const winePageDom = new JSDOM(winePageHtml);
          // Check if millesime is in page title
          let millesime = "";
          if (
            Number.isInteger(
              parseInt(
                winePageDom.window.document
                  .querySelector(".page-title")
                  .innerHTML.trim()
                  .slice(-4)
              )
            )
          )
            millesime = parseInt(
              winePageDom.window.document
                .querySelector(".page-title")
                .innerHTML.trim()
                .slice(-4)
            );
          let bottle = {
            name: winePageDom.window.document
              .querySelector(".page-title")
              .innerHTML.trim(),
            type:
              winePageDom.window.document
                .querySelector("[data-th='Couleur']")
                .innerHTML.toLowerCase()
                .trim() === "rosé"
                ? "rose"
                : winePageDom.window.document
                    .querySelector("[data-th='Couleur']")
                    .innerHTML.toLowerCase()
                    .trim(),
            listed: "Y",
            country: winePageDom.window.document
              .querySelector("[data-th='Pays']")
              .innerHTML.trim(),
            description: "NR",
            saqPrice: parseInt(
              winePageDom.window.document.querySelector("[data-price-amount]")
                .dataset.priceAmount
            ),
            saqCode: saqCode,
            saqUrl: `https://www.saq.com/fr/${saqCode}`,
            saqImg: winePageDom.window.document.querySelector(
              "#mtImageContainer"
            )
              ? winePageDom.window.document
                  .querySelector("#mtImageContainer")
                  .querySelector("img").src
              : "https://www.saq.com/media/wysiwyg/placeholder/category/06.png",
            format: winePageDom.window.document
              .querySelector("[data-th='Format']")
              .innerHTML.trim(),
            alcool: winePageDom.window.document
              .querySelector(`[data-th="Degré d'alcool"]`)
              .innerHTML.trim(),
            maker: winePageDom.window.document
              .querySelector(`[data-th="Producteur"]`)
              .innerHTML.trim(),
            region: winePageDom.window.document.querySelector(
              `[data-th="Région"]`
            )
              ? winePageDom.window.document
                  .querySelector(`[data-th="Région"]`)
                  .innerHTML.trim()
              : "NR",
            millesime: millesime,
          };

          // Save bottle in DB
          async function saveBottle(bottle) {
            let bottleInDB = await Bottle.findOne({
              saqCode: bottle.saqCode,
            });
            if (!bottleInDB) {
              let newBottle = new Bottle(bottle);
              await newBottle.save();
              bottlesInserted++;
            } else bottlesRejected++;
          }
          await saveBottle(bottle);
          bottlesToReturn.push(bottle);
        })
      );
    }
    res.status(200).send({
      bottlesInserted: bottlesInserted,
      bottlesRejected: bottlesRejected,
      bottlesToReturn: bottlesToReturn,
    });
  })
);

module.exports = router;
