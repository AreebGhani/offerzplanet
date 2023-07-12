const mongoose = require("mongoose");
const Product = require("./product");
const Event = require("./event");
const Withdraw = require("./withdraw");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your shop name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your shop email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: "Seller",
  },
  avatar: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },
  withdrawMethod: {
    type: Object,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  transections: [
    {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "Processing",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

// Hash password
shopSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

shopSchema.post(["save", "findOneAndUpdate", "findByIdAndUpdate"], async function (doc, next) {
  const shop = doc;
  try {
    const productShops = await Product.find().select("shop");

    const ObjectId = mongoose.Types.ObjectId;

    productShops.forEach((product) => {
      if (product.shop._id.equals(shop._id)) {
        product.shop = shop;
      }
    });

    await Promise.all(productShops.map((product) => product.save()));

    const eventShops = await Event.find().select("shop");

    eventShops.forEach((event) => {
      if (event.shop._id.equals(shop._id)) {
        event.shop = shop;
      }
    });

    await Promise.all(eventShops.map((event) => event.save()));

    const withdrawShops = await Withdraw.find().select("seller");

    withdrawShops.forEach((withdraw) => {
      if (withdraw.seller._id.equals(shop._id)) {
        withdraw.seller = shop;
      }
    });

    await Promise.all(withdrawShops.map((withdraw) => withdraw.save()));
    next();
  }
  catch (error) {
    next(error);
  }
});

// jwt token
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// comapre password
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Shop", shopSchema);
