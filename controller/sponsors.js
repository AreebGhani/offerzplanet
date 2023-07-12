const Sponsors = require("../model/sponsors");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const fs = require("fs");
const router = express.Router();

// create a new sponsor
router.post("/create-sponsor",
    isAuthenticated,
    isAdmin("Admin"),
    upload.single("image"),
    async (req, res, next) => {
        try {
            const { title } = req.body;
            const isSponsorExist = await Sponsors.findOne({ title });

            if (isSponsorExist) {
                const filename = req.file.filename;
                const filePath = `uploads/${filename}`;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "Error deleting file" });
                    }
                });
                return next(new ErrorHandler("Sponsor already exists", 400));
            }

            const filename = req.file.filename;

            const sponsor = {
                title,
                description: req.body.description,
                image: filename,
                buttonText: req.body.buttonText,
                buttonLink: req.body.buttonLink,
            }

            const sponsors = await Sponsors.create(sponsor);

            res.status(201).json({
                success: true,
                sponsors,
            });
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error.response.message), 500);
        }
    }
);

// get sponsors
router.get(
    "/get-all-sponsors",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const sponsors = await Sponsors.find().sort({ createdAt: -1 });

            res.status(201).json({
                success: true,
                sponsors,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// update sponsor name
router.put("/update-sponsor",
    isAuthenticated,
    isAdmin("Admin"),
    upload.none(),
    async (req, res, next) => {
        try {
            const { _id, title, description, buttonText, buttonLink } = req.body;

            const sponsor = await Sponsors.findOneAndUpdate(
                { _id: _id },
                {
                    title: title,
                    description: description,
                    buttonText: buttonText,
                    buttonLink: buttonLink
                },
                { new: true }
            );

            res.status(201).json({
                success: true,
                sponsor,
            });
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error.response.message), 500);
        }
    }
);

// update sponsor image
router.put("/update-sponsor-image",
    isAuthenticated,
    isAdmin("Admin"),
    upload.single("image"),
    async (req, res, next) => {
        try {
            const { _id, title, description, buttonText, buttonLink } = req.body;

            const isSponsorExist = await Sponsors.findOne({ _id });
            if (isSponsorExist) {
                const filename = isSponsorExist.image;
                const filePath = `uploads/${filename}`;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "Error deleting file" });
                    }
                });
            }

            const filename = req.file.filename;
            const sponsors = await Sponsors.findOneAndUpdate(
                { _id: _id },
                {
                    title: title,
                    description: description,
                    buttonText: buttonText,
                    buttonLink: buttonLink,
                    image: filename,
                },
                { new: true }
            );

            res.status(201).json({
                success: true,
                sponsors,
            });
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error.response.message), 500);
        }
    }
);

// delete sponsor
router.delete(
    "/delete-sponsor/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const sponsorId = req.params.id;

            const sponsorData = await Sponsors.findById(sponsorId);
            const filename = sponsorData.image;
            const filePath = `uploads/${filename}`;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            const sponsor = await Sponsors.findByIdAndDelete(sponsorId);

            if (!sponsor) {
                return next(new ErrorHandler("Sponsor not found with this id!", 500));
            }

            res.status(201).json({
                success: true,
                message: "Sponsor Deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;
