const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Pet = require("../models/Pet");

// GET /api/favorites - Fetch current user's favorite pets
router.get("/", auth, async (req, res) => {
  try {
    // Find user and populate favorites with full pet details
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites || []);
  } catch (err) {
    console.error("GET /favorites error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST /api/favorites/:petId - Add pet to favorites
router.post("/:petId", auth, async (req, res) => {
  try {
    // Verify pet exists
    const pet = await Pet.findById(req.params.petId);
    if (!pet) return res.status(404).json({ msg: "Pet not found" });

    // Get user and add pet if not already favorited
    const user = await User.findById(req.user._id);
    if (!user.favorites.includes(req.params.petId)) {
      user.favorites.push(req.params.petId);
      await user.save();
    }

    // Return updated user with populated favorites
    const updated = await User.findById(req.user._id)
      .populate("favorites")
      .select("-password");
    res.json(updated);
  } catch (err) {
    console.error("POST /favorites error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// DELETE /api/favorites/:petId - Remove pet from favorites
router.delete("/:petId", auth, async (req, res) => {
  try {
    // Remove petId from favorites array
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: req.params.petId } },
      { new: true },
    )
      .populate("favorites")
      .select("-password");

    res.json(user);
  } catch (err) {
    console.error("DELETE /favorites error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
