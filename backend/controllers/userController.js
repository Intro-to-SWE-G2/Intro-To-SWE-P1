const User = require("../models/User");
const Item = require("../models/Item");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send sensitive information
    const userProfile = {
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      overallRating: user.overallRating,
      joinedDate: user.createdAt,
    };

    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's items
exports.getUserItems = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Getting items for user with Auth0 ID:", id);

    // Find items where the seller is this Auth0 ID
    const items = await Item.find({ seller: id });
    console.log(`✅ Found ${items.length} items for user with Auth0 ID:`, id);

    // Format the items for the response
    const formattedItems = items.map((item) => ({
      _id: item._id,
      id: item._id,
      title: item.title,
      name: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      condition: item.condition,
      category: item.category,
      description: item.description,
      listedDate: item.listedDate,
      location: item.location,
      images: item.images || [],
      averageRating: item.averageRating,
      reviewCount: item.reviews ? item.reviews.length : 0,
    }));

    res.json(formattedItems);
  } catch (err) {
    console.error("❌ Error getting user items:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get current user profile
exports.getCurrentUserProfile = async (req, res) => {
  try {
    if (!req.auth || !req.auth.sub) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = req.auth.sub;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching current user profile:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create or update user profile
exports.createOrUpdateUser = async (req, res) => {
  try {
    if (!req.auth || !req.auth.sub) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = req.auth.sub;
    console.log("🔍 Creating/updating user:", userId);

    // Check if user exists
    let user = await User.findById(userId);

    if (user) {
      console.log("✅ User exists, updating fields");
      // Update existing user
      const updates = {};
      const { name, username, email, avatar } = req.body;

      if (name && name !== user.name) updates.name = name;
      if (username && username !== user.username) updates.username = username;
      if (email && email !== user.email) updates.email = email;
      if (avatar && avatar !== user.avatar) updates.avatar = avatar;

      if (Object.keys(updates).length > 0) {
        user = await User.findByIdAndUpdate(
          userId,
          { $set: updates },
          { new: true }
        );
        console.log("✅ User updated:", user._id);
      }
    } else {
      console.log("🆕 Creating new user");
      // Create new user
      const { name, username, email, avatar } = req.body;

      user = new User({
        _id: userId,
        name: name || "New User",
        username: username || `user${Math.floor(Math.random() * 10000)}`,
        email: email || "",
        avatar: avatar || "",
        responseRate: "Usually responds within a day",
        responseTime: "~24 hours",
      });

      await user.save();
      console.log("✅ New user created:", user._id);
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error creating/updating user:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/users/:id — get user profile (public)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Getting user profile for ID:", id);

    // Find the user
    let user = await User.findById(id);

    // If user doesn't exist, create a minimal user record
    if (!user) {
      console.log("⚠️ User not found, creating minimal user record");

      // Create a minimal user
      user = new User({
        _id: id,
        name: "User",
        username: "user_" + id.substring(id.length - 6),
        email: "",
        avatar: "",
        createdAt: new Date(),
      });

      await user.save();
      console.log("✅ Created minimal user record:", user._id);
    } else {
      console.log("✅ Found user:", user._id);
    }

    // Format the response - only include public information
    const response = {
      _id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      overallRating: user.overallRating,
      reviewCount: user.reviewCount || 0,
      joinedDate: user.createdAt,
      responseRate: user.responseRate,
      responseTime: user.responseTime,
    };

    res.json(response);
  } catch (err) {
    console.error("❌ Error getting user profile:", err);
    res.status(500).json({ error: err.message });
  }
};
