const Configs = require("../model/config");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const fs = require("fs");
const router = express.Router();

// create a new config
router.post("/create-config",
    isAuthenticated,
    isAdmin("Admin"),
    async (req, res, next) => {
        try {
            const { host, service, port, password, mail, api, secret } = req.body;
            
            const isMailExist = await Configs.findOne({ "smtp.mail": mail });
            const isApiExist = await Configs.findOne({ "stripe.api": api });

            if (isMailExist || isApiExist) {
                return next(new ErrorHandler("Already exists", 400));
            }

           const configData = {
              smtp: { host, service, port, password, mail },
              stripe: { api, secret },
           }

           const config = await Configs.create(configData);

            res.status(201).json({
                success: true,
                message: "Configuration Added Successfully!",
                config,
                
            });
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error.response.message), 500);
        }
    }
);

// get config
router.get(
    "/get-config",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const config = await Configs.find();

            res.status(201).json({
                success: true,
                config,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// update config
router.put(
    "/update-config/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {

            const configId = req.params.id;
            const { host, service, port, password, mail, api, secret } = req.body;

            const config = await Configs.findById(configId);

            if (!config) {
                return next(new ErrorHandler("Not found with this id!", 500));
            }

           config.smtp[0].host = host;
           config.smtp[0].service = service;
           config.smtp[0].port = port;
           config.smtp[0].password = password;
           config.smtp[0].mail = mail;
           config.stripe[0].api = api;
           config.stripe[0].secret = secret;

           await config.save();

            res.status(201).json({
                success: true,
                message: "Configuration Updated Successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;
