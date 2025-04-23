const express = require("express");
const User = require("../models/User");
const {
  getUserProfile,
  getUserItems,
  getCurrentUserProfile,
  createOrUpdateUser,
  getUserById,
} = require("../controllers/userController");
const { checkJwt } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate(
      "sellingItems",
      "name price averageRating"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public routes (no authentication required)
router.get("/:id", getUserById); // Get user profile by ID
router.get("/:id/items", getUserItems); // Get user's items

// Protected routes (authentication required)
router.get("/me", checkJwt, getCurrentUserProfile); // Get current user profile
router.post("/", checkJwt, createOrUpdateUser); // Create or update user profile

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = new User({ username, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: Also delete items sold by this user
    await Item.deleteMany({ seller: user._id });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
