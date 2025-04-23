const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a review schema
const reviewSchema = new Schema({
  user: {
    type: String, // Changed from ObjectId to String to support Auth0 IDs
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const itemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    category: {
      type: String,
      required: true,
    },
    listedDate: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    seller: {
      type: String, // Changed from ObjectId to String to support Auth0 IDs
      ref: "User",
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratings: [Number],
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Method to update the average rating
itemSchema.methods.updateAverageRating = async function () {
  const item = this;

  console.log("🔄 Updating average rating for item:", item._id);
  console.log("🔍 Reviews count:", item.reviews.length);

  if (!item.reviews || item.reviews.length === 0) {
    console.log("⚠️ No reviews found, setting average rating to 0");
    item.averageRating = 0;
    return;
  }

  // Log each review to check for issues
  item.reviews.forEach((review, index) => {
    console.log(`Review ${index}:`, {
      user: review.user,
      rating: review.rating,
      comment: review.comment
        ? review.comment.substring(0, 20) + "..."
        : "(no comment)",
    });
  });

  // Filter out any invalid reviews (those without a rating)
  const validReviews = item.reviews.filter(
    (review) => review.rating && review.rating >= 1 && review.rating <= 5
  );
  console.log(`🔍 Valid reviews count: ${validReviews.length}`);

  if (validReviews.length === 0) {
    console.log("⚠️ No valid reviews found, setting average rating to 0");
    item.averageRating = 0;
    return;
  }

  const totalRating = validReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  item.averageRating = totalRating / validReviews.length;

  console.log(
    `✅ New average rating: ${item.averageRating} (from ${validReviews.length} reviews)`
  );
};

// Add a pre-save hook to ensure all reviews have a user
itemSchema.pre("save", function (next) {
  console.log("🔍 Pre-save hook: Checking reviews");

  // Filter out any reviews without a user
  if (this.reviews && this.reviews.length > 0) {
    const validReviews = this.reviews.filter((review) => review.user);

    if (validReviews.length !== this.reviews.length) {
      console.log(
        `⚠️ Found ${
          this.reviews.length - validReviews.length
        } invalid reviews, removing them`
      );
      this.reviews = validReviews;
    }
  }

  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
