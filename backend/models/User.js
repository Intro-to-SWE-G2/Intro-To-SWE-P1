const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: {
      type: String, // Changed from ObjectId to String to support Auth0 IDs
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    avatar: {
      type: String,
    },
    sellingItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    overallRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    responseRate: {
      type: String,
    },
    responseTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Function to update the overall rating based on item ratings
userSchema.methods.updateOverallRating = async function () {
  const user = this;
  await user.populate("sellingItems");

  if (user.sellingItems.length === 0) {
    user.overallRating = 0;
  } else {
    const totalRatings = user.sellingItems.reduce(
      (sum, item) => sum + (item.averageRating || 0),
      0
    );
    user.overallRating = totalRatings / user.sellingItems.length;
  }

  await user.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
