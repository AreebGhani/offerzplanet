const mongoose = require("mongoose");
const Product = require("./product");
const Event = require("./event");
const Order = require("./order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phoneNumber: {
    type: Number,
  },
  addresses: [
    {
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
      addressType: {
        type: String,
      },
    }
  ],
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.post(["save", "findOneAndUpdate"], async function (doc, next) {
  const user = doc;
  try {
    const productReviews = await Product.find().select("reviews");

    const ObjectId = mongoose.Types.ObjectId;

    productReviews.forEach((product) => {
      product.reviews.forEach((review) => {
        const reviewUserId = new ObjectId(review.user._id);
        if (reviewUserId.equals(user._id)) {
          review.user = user;
        }
      });
    });

    await Promise.all(productReviews.map((product) => product.save()));

    const eventReviews = await Event.find().select("reviews");

    eventReviews.forEach((event) => {
      event.reviews.forEach((review) => {
        const reviewUserId = new ObjectId(review.user._id);
        if (reviewUserId.equals(user._id)) {
          review.user = user;
        }
      });
    });

    await Promise.all(eventReviews.map((event) => event.save()));

    const allOrderUser = await Order.find().select("user");

    allOrderUser.forEach((order) => {
      const orderUserId = new ObjectId(order.user._id);
      if (orderUserId.equals(user._id)) {
        order.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
          phoneNumber: user.phoneNumber,
          addresses: order.user.addresses,
        };
      }
    });

    await Promise.all(allOrderUser.map((order) => order.save()));
    next();
  }
  catch (error) {
    next(error);
  }
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
