const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const AdoptionRequest = require("../models/AdoptionRequest");
const User = require("../models/User");

// Middleware to verify admin role
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Forbidden" });
  next();
};

// Get admin stats
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const totalAdoptions = await AdoptionRequest.countDocuments({
      status: "approved",
    });

    const pendingRequests = await AdoptionRequest.countDocuments({
      status: "pending",
    });

    const mostPopularPets = await AdoptionRequest.aggregate([
      { $group: { _id: "$pet", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "pets",
          localField: "_id",
          foreignField: "_id",
          as: "petInfo",
        },
      },
      { $unwind: "$petInfo" },
      {
        $project: {
          petName: "$petInfo.name",
          petId: "$_id",
          requestCount: "$count",
        },
      },
    ]);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      totalAdoptions,
      pendingRequests,
      mostPopularPets,
      recentSignups,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
