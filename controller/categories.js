const Categories = require("../model/categories");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const fs = require("fs");
const router = express.Router();

// create a new categories
router.post("/create-category",
    isAuthenticated,
    isAdmin("Admin"),
    upload.single("image"),
    async (req, res, next) => {
        try {
            const { name } = req.body;
            const isCategoriesExist = await Categories.findOne({ name });

            if (isCategoriesExist) {
                const filename = req.file.filename;
                const filePath = `uploads/${filename}`;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "Error deleting file" });
                    }
                });
                return next(new ErrorHandler("Category already exists", 400));
            }

            const filename = req.file.filename;

            const category = {
                name,
                image: filename,
            }

            const categories = await Categories.create(category);

            res.status(201).json({
                success: true,
                categories,
            });
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error.response.message), 500);
        }
    }
);

// get categories
router.get(
    "/get-all-categories",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const categories = await Categories.find().sort({ createdAt: -1 });

            res.status(201).json({
                success: true,
                categories,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// delete categories
router.delete(
    "/delete-category/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const categoryId = req.params.id;

            const categoryData = await Categories.findById(categoryId);
            const filename = categoryData.image;
            const filePath = `uploads/${filename}`;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            const category = await Categories.findByIdAndDelete(categoryId);

            if (!category) {
                return next(new ErrorHandler("Category not found with this id!", 500));
            }

            res.status(201).json({
                success: true,
                message: "Category Deleted successfully!",
            });
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;
