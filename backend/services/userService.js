const User = require("../models/User");

/**
 * Get or create a user based on Auth0 profile
 * @param {Object} auth0Profile - The Auth0 user profile
 * @returns {Promise<Object>} The user document
 */
exports.getOrCreateUser = async (auth0Profile) => {
  try {
    if (!auth0Profile || !auth0Profile.sub) {
      console.error("❌ Invalid Auth0 profile:", auth0Profile);
      throw new Error("Invalid Auth0 profile");
    }

    console.log("🔍 Looking up user:", auth0Profile.sub);

    // Check if user already exists
    let user = await User.findById(auth0Profile.sub);

    if (user) {
      console.log("✅ User exists, checking for updates");
      // User exists, update any changed fields
      const updates = {};

      if (auth0Profile.name && auth0Profile.name !== user.name) {
        updates.name = auth0Profile.name;
      }

      if (auth0Profile.email && auth0Profile.email !== user.email) {
        updates.email = auth0Profile.email;
      }

      if (auth0Profile.picture && auth0Profile.picture !== user.avatar) {
        updates.avatar = auth0Profile.picture;
      }

      // If we have updates, apply them
      if (Object.keys(updates).length > 0) {
        console.log("🔄 Updating user with:", updates);
        user = await User.findByIdAndUpdate(
          auth0Profile.sub,
          { $set: updates },
          { new: true }
        );
        console.log("✅ User updated:", user._id);
      }

      return user;
    }

    console.log("🆕 Creating new user from Auth0 profile");

    // User doesn't exist, create a new one
    const username =
      auth0Profile.nickname ||
      auth0Profile.email?.split("@")[0] ||
      auth0Profile.name?.replace(/\s+/g, "").toLowerCase() ||
      `user${Math.floor(Math.random() * 10000)}`;

    console.log("👤 Generated username:", username);

    const newUser = new User({
      _id: auth0Profile.sub,
      name: auth0Profile.name || "New User",
      username: username,
      email: auth0Profile.email || "",
      avatar: auth0Profile.picture || "",
      responseRate: "Usually responds within a day",
      responseTime: "~24 hours",
    });

    console.log("💾 Saving new user:", JSON.stringify(newUser, null, 2));

    await newUser.save();
    console.log("✅ New user created:", newUser._id);

    return newUser;
  } catch (error) {
    console.error("❌ Error in getOrCreateUser:", error);
    throw error;
  }
};

/**
 * Get user profile by ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The user document
 */
exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error("❌ Error in getUserById:", error);
    throw error;
  }
};
