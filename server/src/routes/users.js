const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET /api/users/profile - Fetch current user's profile
router.get("/profile", auth, async (req, res) => {
  try {
    // req.user is already populated by the auth middleware
    // and excludes the password field (see auth.js line 10)
    res.json(req.user);
  } catch (err) {
    console.error("GET /profile error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// PUT /api/users/profile - Update current user's profile
router.put("/profile", auth, async (req, res) => {
  const { name, email } = req.body;
  try {
    if (!name || !email) {
      return res.status(400).json({ msg: "Name and email required" });
    }

    // Check if new email is already in use by another user
    if (email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ msg: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("PUT /profile error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
