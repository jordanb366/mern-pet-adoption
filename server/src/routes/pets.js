const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "..", "uploads");
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.get("/", async (req, res) => {
  const pets = await Pet.find().sort({ createdAt: -1 });
  res.json(pets);
});

router.get("/:id", async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ msg: "Pet not found" });
  res.json(pet);
});

router.post("/", auth, upload.single("image"), async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Forbidden" });

  try {
    const payload = {
      name: req.body.name,
      species: req.body.species,
      age: req.body.age ? Number(req.body.age) : undefined,
      description: req.body.description,
    };

    if (req.file) {
      payload.imageUrl = `/uploads/${req.file.filename}`;
    }

    const pet = await Pet.create(payload);
    res.json(pet);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update a pet (admin only)
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Forbidden" });
  try {
    const payload = { ...req.body };
    if (payload.age) payload.age = Number(payload.age);
    if (req.file) {
      payload.imageUrl = `/uploads/${req.file.filename}`;
    }

    const pet = await Pet.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    if (!pet) return res.status(404).json({ msg: "Pet not found" });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete a pet (admin only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Forbidden" });
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ msg: "Pet not found" });
    res.json({ msg: "Pet removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/pets/stats/favorite-counts - Get count of favorites for each pet
router.get("/stats/favorite-counts", async (req, res) => {
  try {
    const User = require("../models/User");

    // Aggregate favorite counts by pet
    const results = await User.aggregate([
      { $unwind: "$favorites" },
      { $group: { _id: "$favorites", count: { $sum: 1 } } },
    ]);

    // Convert to object format { petId: count }
    const counts = {};
    results.forEach((item) => {
      counts[item._id.toString()] = item.count;
    });

    res.json(counts);
  } catch (err) {
    console.error("GET /stats/favorite-counts error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
