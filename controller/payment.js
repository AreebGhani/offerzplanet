const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Configs = require("../model/config");

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const config = await Configs.find();
    const stripe = require("stripe")(config[0].stripe[0].secret);
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "pkr",
      metadata: {
        company: "Offerzplanet",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    const config = await Configs.find();
    const stripe = require("stripe")(config[0].stripe[0].secret);
    res.status(200).json({ stripeApikey: config[0].stripe[0].api });
  })
);


module.exports = router;