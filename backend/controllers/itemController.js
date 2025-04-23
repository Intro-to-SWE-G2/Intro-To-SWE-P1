// File: backend/controllers/itemController.js
const Item = require("../models/Item");
const User = require("../models/User");

// Create a new item
exports.createItem = async (req, res) => {
  try {
    // Get the authenticated user ID from Auth0
    const auth0UserId = req.auth.sub;
    console.log("🔑 Auth0 user ID for item creation:", auth0UserId);

    // Find the user in our MongoDB database
    let user = await User.findById(auth0UserId);

    if (!user) {
      console.log(
        "⚠️ User not found in database, creating new user with Auth0 ID"
      );
      // Create a minimal user if not found, using Auth0 ID as the _id
      user = new User({
        _id: auth0UserId, // Use Auth0 ID as MongoDB _id
        name: req.body.userName || "Anonymous",
        username:
          req.body.userEmail?.split("@")[0] || req.body.userName || "user",
        email: req.body.userEmail || "",
        avatar: "",
      });

      await user.save();
      console.log("✅ New user created with Auth0 ID:", user._id);
    } else {
      console.log("✅ Found user in database with Auth0 ID:", user._id);
    }

    // Extract fields from request body
    const {
      name,
      description,
      price,
      originalPrice,
      condition,
      category,
      location,
      images,
    } = req.body;

    // Create the new item with the Auth0 ID as the seller
    const newItem = new Item({
      title: name,
      description,
      price,
      originalPrice,
      condition,
      category,
      listedDate: new Date(),
      location,
      images,
      seller: auth0UserId, // Use Auth0 ID directly
    });

    const saved = await newItem.save();
    console.log("✅ Item saved with seller Auth0 ID:", saved.seller);

    // Add the item to the user's sellingItems array
    if (!user.sellingItems) {
      user.sellingItems = [];
    }

    user.sellingItems.push(saved._id);
    await user.save();
    console.log("✅ Item added to user's sellingItems array");

    return res.status(201).json({ success: true, item: saved });
  } catch (err) {
    console.error("❌ Failed to create item:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/items — paginated summaries
exports.getItems = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Item.countDocuments();
    const items = await Item.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("seller", "name")
      .select(
        "title price condition category images featured recommended createdAt description"
      )
      .lean();

    const results = items.map((item) => ({
      id: item._id,
      name: item.title,
      price: item.price,
      condition: item.condition,
      category: item.category,
      image: (item.images && item.images[0]) || "/placeholder.svg",
      seller: {
        _id: item.seller._id,
        username: item.seller?.name || "Unknown",
      },
      postedDate: item.createdAt.toISOString().split("T")[0],
      description: item.description,
      featured: item.featured,
      recommended: item.recommended,
    }));

    res.json({
      data: results,
      page,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/items/:id — full details with reviews & related items
exports.getItemById = async (req, res) => {
  try {
    console.log("🔍 Getting item details for ID:", req.params.id);

    // First find the item without populating seller
    const item = await Item.findById(req.params.id).lean();

    if (!item) {
      console.log("❌ Item not found");
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("✅ Found item:", item._id);
    console.log("🔍 Seller ID:", item.seller);

    // Manually fetch the seller since we're using string IDs
    let seller = null;
    try {
      seller = await User.findById(item.seller).lean();
      console.log("✅ Found seller:", seller ? seller._id : "Not found");
    } catch (err) {
      console.error("❌ Error fetching seller:", err.message);
    }

    // Find related items
    const related = await Item.find({
      _id: { $ne: item._id },
      category: item.category,
    })
      .limit(3)
      .select("title price images condition")
      .lean();

    console.log(`✅ Found ${related.length} related items`);

    const formattedRelated = related.map((rel) => ({
      _id: rel._id,
      id: rel._id,
      name: rel.title,
      price: rel.price,
      image:
        rel.images && rel.images.length > 0
          ? rel.images[0]
          : "/placeholder.svg?height=200&width=200",
      condition: rel.condition,
    }));

    // Manually populate user info for reviews
    const userIds = [...new Set(item.reviews.map((review) => review.user))];
    console.log(`🔍 Looking up ${userIds.length} users for reviews`);

    const users = await User.find({ _id: { $in: userIds } }).lean();
    console.log(`✅ Found ${users.length} users for reviews`);

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user;
    });

    const populatedReviews = item.reviews.map((review) => {
      const user = userMap[review.user] || null;
      return {
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        user: user
          ? {
              _id: user._id,
              name: user.name,
              username: user.username,
              avatar: user.avatar,
            }
          : null,
      };
    });

    // Construct the response
    const response = {
      _id: item._id,
      id: item._id,
      name: item.title,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      condition: item.condition,
      description: item.description,
      category: item.category,
      listedDate: item.listedDate
        ? item.listedDate.toISOString().split("T")[0]
        : null,
      location: item.location,
      images: item.images || [],
      seller: seller
        ? {
            _id: seller._id,
            id: seller._id,
            username: seller.username || seller.name,
            name: seller.name,
            avatar: seller.avatar,
            rating: seller.overallRating,
            reviewCount: seller.reviewCount,
            joinedDate: seller.createdAt,
            responseRate: seller.responseRate,
            responseTime: seller.responseTime,
          }
        : {
            _id: item.seller,
            id: item.seller,
            username: "Unknown Seller",
            name: "Unknown Seller",
          },
      averageRating: item.averageRating,
      ratingsCount: item.ratings ? item.ratings.length : 0,
      reviews: populatedReviews,
      relatedItems: formattedRelated,
    };

    console.log("✅ Sending item response");
    res.json(response);
  } catch (err) {
    console.error("❌ Error getting item by ID:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/items/:id/rate — add a numeric rating
exports.rateItem = async (req, res) => {
  try {
    const { rating } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.ratings.push(Number(rating));
    await item.updateAverageRating();
    res.json({
      averageRating: item.averageRating,
      ratingsCount: item.ratings.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Utility function to ensure user exists before adding a review
const ensureUserExists = async (userId) => {
  console.log("🔍 Ensuring user exists:", userId);

  let user = await User.findById(userId);

  if (!user) {
    console.log("⚠️ User not found, creating minimal user record");
    user = new User({
      _id: userId,
      name: "Anonymous User",
      username: "user_" + userId.substring(userId.length - 6),
      email: "",
      avatar: "",
    });

    await user.save();
    console.log("✅ Created minimal user record:", user._id);
  } else {
    console.log("✅ User exists:", user._id);
  }

  return user;
};

// POST /api/items/:id/reviews — add a full review
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Get the authenticated user ID from Auth0
    const userId = req.auth.sub;
    console.log("🔍 Adding review from user with Auth0 ID:", userId);
    console.log("🔍 Item ID:", id);
    console.log("🔍 Rating:", rating);
    console.log("🔍 Comment:", comment);

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Find the item
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    console.log("✅ Found item:", item._id);
    console.log("🔍 Current reviews:", JSON.stringify(item.reviews));

    // Check if user has already reviewed this item
    const existingReviewIndex = item.reviews.findIndex(
      (review) => review.user && review.user.toString() === userId
    );

    console.log("🔍 Existing review index:", existingReviewIndex);

    if (existingReviewIndex !== -1) {
      console.log("🔄 Updating existing review");
      // Update existing review
      item.reviews[existingReviewIndex].rating = rating;
      item.reviews[existingReviewIndex].comment = comment;
      item.reviews[existingReviewIndex].updatedAt = Date.now();
    } else {
      console.log("➕ Adding new review with user ID:", userId);

      // Create a new review object with all required fields
      const newReview = {
        user: userId,
        rating: rating,
        comment: comment || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("🔍 New review object:", JSON.stringify(newReview));

      // Add new review
      item.reviews.push(newReview);
    }

    console.log("🔍 Reviews after update:", JSON.stringify(item.reviews));

    // Update average rating
    await item.updateAverageRating();
    console.log("✅ Updated item average rating:", item.averageRating);

    // Save the item with the new/updated review
    try {
      await item.save();
      console.log("✅ Saved item with new/updated review");
    } catch (saveErr) {
      console.error("❌ Error saving item:", saveErr);
      // Log the validation errors in detail
      if (saveErr.errors) {
        Object.keys(saveErr.errors).forEach((key) => {
          console.error(
            `Validation error for ${key}:`,
            saveErr.errors[key].message
          );
          console.error(`Value:`, saveErr.errors[key].value);
        });
      }
      throw saveErr;
    }

    // Ensure the user exists in the database
    await ensureUserExists(userId);

    // Manually populate user info since we're using string IDs
    const userIds = [...new Set(item.reviews.map((review) => review.user))];
    console.log("🔍 Looking up users for reviews:", userIds);

    const users = await User.find({ _id: { $in: userIds } });
    console.log(`✅ Found ${users.length} users for reviews`);

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user;
    });

    const populatedReviews = item.reviews.map((review) => {
      const user = userMap[review.user] || null;
      return {
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        user: user
          ? {
              _id: user._id,
              name: user.name,
              username: user.username,
              avatar: user.avatar,
            }
          : {
              _id: review.user,
              name: "Anonymous User",
              username: "anonymous",
              avatar: "",
            },
      };
    });

    res.json(populatedReviews);
  } catch (err) {
    console.error("❌ Error adding review:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/items/:id/reviews/:reviewId — delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userId = req.auth.sub; // Auth0 ID
    console.log("🔍 Deleting review:", reviewId, "by user:", userId);

    // Find the item
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Find the review
    const reviewIndex = item.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if the user is the author of the review
    if (item.reviews[reviewIndex].user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this review" });
    }

    // Remove the review
    item.reviews.splice(reviewIndex, 1);
    console.log("✅ Review removed from item");

    // Update average rating
    await item.updateAverageRating();
    console.log("✅ Updated item average rating:", item.averageRating);

    await item.save();
    console.log("✅ Saved item with review removed");

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting review:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getItemsBySellerId = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.params.sellerId })
      .sort({ createdAt: -1 })
      .populate("seller", "name username _id")
      .lean();

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Optional: ensure the user is the item's owner
    if (req.auth.sub !== item.seller)
      return res
        .status(403)
        .json({ message: "Not authorized to delete this item" });

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
