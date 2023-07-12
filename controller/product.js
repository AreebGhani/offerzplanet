const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../model/product");
const Event = require("../model/event");
const CoupounCode = require("../model/coupounCode");
const Order = require("../model/order");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");

// create product
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);

        const productData = req.body;
        productData.images = imageUrls;
        productData.shop = shop;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id }).sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// update product name
router.put(
  "/update-product",
  upload.none(),
  async (req, res, next) => {
    try {

      const { _id, shopId } = req.body;

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {

        const products = await Product.findOneAndUpdate(
          { _id: _id },
          { ...req.body },
          { new: true }
        );

        res.status(201).json({
          success: true,
          products,
        });
      }
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.response.message), 500);
    }
  }
);

// update product images
router.put(
  "/update-product-images",
  upload.array("images"),
  async (req, res, next) => {
    try {
      const { _id, shopId } = req.body;

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const isProductExist = await Product.findOne({ _id });
        if (isProductExist) {
          isProductExist.images.forEach((imageUrl) => {
            const filename = imageUrl;
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
              if (err) {
                console.log(err);
              }
            });
          });
        }

        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);

        req.body.images = imageUrls;

        const products = await Product.findOneAndUpdate(
          { _id: _id },
          { ...req.body },
          { new: true }
        );

        res.status(201).json({
          success: true,
          products,
        });
      }
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.response.message), 500);
    }
  }
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const productData = await Product.findById(productId);

      productData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const coupounCodes = await CoupounCode.find().select("selectedProduct");

      if (coupounCodes.length > 0) {
        const ObjectId = mongoose.Types.ObjectId;
        coupounCodes.forEach(async (code) => {
          const selectedProductId = new ObjectId(code.selectedProduct);
          if (selectedProductId.equals(productData._id)) {
            await CoupounCode.findByIdAndDelete(code._id);
          }
        })
      }

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found with this id!", 500));
      }

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const product = await Product.findById(productId);

      if (!product) {
        const product = await Event.findById(productId);
        const isReviewed = product.reviews.find(
          (rev) => rev.user._id === req.user._id
        );

        if (isReviewed) {
          product.reviews.forEach((rev) => {
            if (rev.user._id === req.user._id) {
              (rev.rating = rating), (rev.comment = comment), (rev.user = user);
            }
          });
        } else {
          product.reviews.push(review);
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
          avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        await Order.findByIdAndUpdate(
          orderId,
          { $set: { "cart.$[elem].isReviewed": true } },
          { arrayFilters: [{ "elem._id": productId }], new: true }
        );

        res.status(200).json({
          success: true,
          message: "Reviwed succesfully!",
        });
      } else {
        const isReviewed = product?.reviews.find(
          (rev) => rev.user._id === req.user._id
        );

        if (isReviewed) {
          product?.reviews.forEach((rev) => {
            if (rev.user._id === req.user._id) {
              (rev.rating = rating), (rev.comment = comment), (rev.user = user);
            }
          });
        } else {
          product?.reviews.push(review);
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
          avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        await Order.findByIdAndUpdate(
          orderId,
          { $set: { "cart.$[elem].isReviewed": true } },
          { arrayFilters: [{ "elem._id": productId }], new: true }
        );

        res.status(200).json({
          success: true,
          message: "Reviwed succesfully!",
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
