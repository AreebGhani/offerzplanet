const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Event = require("../model/event");
const Order = require("../model/order");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const fs = require("fs");

// create event
router.post(
  "/create-event",
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

        const eventData = req.body;
        eventData.images = imageUrls;
        eventData.shop = shop;

        const events = await Event.create(eventData);

        res.status(201).json({
          success: true,
          events,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all events of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id }).sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// update event name
router.put(
  "/update-event",
  upload.none(),
  async (req, res, next) => {
    try {

      const { _id, shopId } = req.body;

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {

        const events = await Event.findOneAndUpdate(
          { _id: _id },
          { ...req.body },
          { new: true }
        );

        res.status(201).json({
          success: true,
          events,
        });
      }
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.response.message), 500);
    }
  }
);

// update event images
router.put(
  "/update-event-images",
  upload.array("images"),
  async (req, res, next) => {
    try {
      const { _id, shopId } = req.body;

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const isEventExist = await Event.findOne({ _id });
        if (isEventExist) {
          isEventExist.images.forEach((imageUrl) => {
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

        const events = await Event.findOneAndUpdate(
          { _id: _id },
          { ...req.body },
          { new: true }
        );

        res.status(201).json({
          success: true,
          events,
        });
      }
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.response.message), 500);
    }
  }
);

// delete event of a shop
router.delete(
  "/delete-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const eventData = await Event.findById(productId);

      eventData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const event = await Event.findByIdAndDelete(productId);

      if (!event) {
        return next(new ErrorHandler("Event not found with this id!", 500));
      }

      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for event
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Event.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      if (!product) {
        const product = await Product.findById(productId);

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
      } else {
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
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
