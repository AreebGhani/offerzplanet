const Categories = require("../model/categories");
const Product = require("../model/product");
const Event = require("../model/event");
const CoupounCode = require("../model/coupounCode");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const mongoose = require("mongoose");
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

// update category name
router.put("/update-category",
    isAuthenticated,
    isAdmin("Admin"),
    upload.none(),
    async (req, res, next) => {
        try {
            const { _id, name } = req.body;

            const categories = await Categories.findOneAndUpdate(
                { _id: _id },
                { name: name },
                { new: true }
            );

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

// update category image
router.put("/update-category-image",
    isAuthenticated,
    isAdmin("Admin"),
    upload.single("image"),
    async (req, res, next) => {
        try {
            const { _id, name } = req.body;

            const isCategoryExist = await Categories.findOne({ _id });
            if (isCategoryExist) {
                const filename = isCategoryExist.image;
                const filePath = `uploads/${filename}`;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "Error deleting file" });
                    }
                });
            }

            const filename = req.file.filename;
            const categories = await Categories.findOneAndUpdate(
                { _id: _id },
                {
                    name: name,
                    image: filename,
                },
                { new: true }
            );

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

            const ObjectId = mongoose.Types.ObjectId;

            const productCategories = await Product.find().select("category");
            if (productCategories.length > 0) {
                productCategories.forEach(async (product) => {
                    const productCategoryId = new ObjectId(product.category);
                    if (productCategoryId.equals(categoryData._id)) {
                        const coupounCodes = await CoupounCode.find().select("selectedProduct");
                        if (coupounCodes.length > 0) {
                            coupounCodes.forEach(async (code) => {
                                const selectedProductId = new ObjectId(code.selectedProduct);
                                if (selectedProductId.equals(product._id)) {
                                    await CoupounCode.findByIdAndDelete(code._id);
                                }
                            })
                        }
                        await Product.findByIdAndDelete(product._id);
                    }
                });
            }

            const eventCategories = await Event.find().select("category");
            if (eventCategories.length > 0) {
                eventCategories.forEach(async (event) => {
                    const eventCategoryId = new ObjectId(event.category);
                    if (eventCategoryId.equals(categoryData._id)) {
                        await Event.findByIdAndDelete(event._id);
                    }
                });
            }

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
