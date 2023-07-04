const Brands = require("../model/brands");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const fs = require("fs");
const router = express.Router();

// create a new brand
router.post("/create-brand",
    isAuthenticated,
    isAdmin("Admin"),
    upload.single("image"),
    async (req, res, next) => {
        try {
            const { name } = req.body;
            const isBrandExist = await Brands.findOne({ name });

            if (isBrandExist) {
                const filename = req.file.filename;
                const filePath = `uploads/${filename}`;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "Error deleting file" });
                    }
                });
                return next(new ErrorHandler("Brand already exists", 400));
            }

            const filename = req.file.filename;

            const brand = {
                name,
                image: filename,
            }

            const brands = await Brands.create(brand);

            res.status(201).json({
                success: true,
                brands,
            });
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error.response.message), 500);
        }
    }
);

// get brands
router.get(
    "/get-all-brands",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const brands = await Brands.find().sort({ createdAt: -1 });

            res.status(201).json({
                success: true,
                brands,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// delete brands
router.delete(
    "/delete-brand/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const brandId = req.params.id;

            const brandData = await Brands.findById(brandId);
            const filename = brandData.image;
            const filePath = `uploads/${filename}`;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            const brand = await Brands.findByIdAndDelete(brandId);

            if (!brand) {
                return next(new ErrorHandler("Brand not found with this id!", 500));
            }

            res.status(201).json({
                success: true,
                message: "Brand Deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;
