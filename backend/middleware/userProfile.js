const { getOrCreateUser } = require("../services/userService");
const axios = require("axios");
const User = require("../models/User");

/**
 * Middleware to ensure user profile exists in our database
 */
const ensureUserProfile = async (req, res, next) => {
  try {
    // Skip if not authenticated
    if (!req.auth || !req.auth.sub) {
      console.log("⚠️ No auth info in request, skipping user profile check");
      return next();
    }

    console.log("🔍 Processing authenticated request for user:", req.auth.sub);

    // First check if user already exists in our database
    try {
      const existingUser = await User.findById(req.auth.sub);
      if (existingUser) {
        console.log("✅ User already exists in database:", existingUser._id);
        req.user = existingUser;
        return next();
      }
      console.log("⚠️ User not found in database, will try to create");
    } catch (err) {
      console.error("❌ Error checking for existing user:", err.message);
    }

    // Get user info from Auth0 Management API
    const token = req.headers.authorization;

    if (!token) {
      console.log("⚠️ No authorization token in request");
      return next();
    }

    console.log(
      "🔑 Authorization token found, fetching user profile from Auth0"
    );

    try {
      // Try to get user profile from Auth0
      const response = await axios.get(`${process.env.AUTH0_ISSUER}userinfo`, {
        headers: {
          Authorization: token,
        },
      });

      const auth0Profile = response.data;
      console.log(
        "✅ Retrieved Auth0 profile:",
        JSON.stringify(auth0Profile, null, 2)
      );

      // Ensure user exists in our database
      const user = await getOrCreateUser(auth0Profile);
      console.log("✅ User ensured in database:", user._id);

      // Attach user to request object
      req.user = user;
    } catch (error) {
      console.error("❌ Error fetching Auth0 profile:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }

      // Try to create a minimal user profile from the auth info
      try {
        console.log(
          "🔄 Attempting to create minimal user profile from auth info"
        );
        const userId = req.auth.sub;

        // Check if user already exists (double-check)
        const existingUser = await User.findById(userId);
        if (existingUser) {
          console.log("✅ User found on second check:", existingUser._id);
          req.user = existingUser;
          return next();
        }

        // Create minimal user
        const newUser = new User({
          _id: userId,
          name: req.auth.name || "New User",
          username: `user${Math.floor(Math.random() * 10000)}`,
          email: req.auth.email || "",
          avatar: "",
          responseRate: "Usually responds within a day",
          responseTime: "~24 hours",
        });

        await newUser.save();
        console.log("✅ Created minimal user profile:", newUser._id);
        req.user = newUser;
      } catch (err) {
        console.error("❌ Failed to create minimal user profile:", err.message);
      }
    }

    next();
  } catch (error) {
    console.error("❌ Error in ensureUserProfile middleware:", error);
    next();
  }
};

// Export the middleware correctly
module.exports = { ensureUserProfile };
