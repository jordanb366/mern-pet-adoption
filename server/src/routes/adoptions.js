const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");
const mailer = require("../utils/mailer");
const emailTemplates = require("../utils/emailTemplates");

// Create an adoption request (logged-in users)
router.post("/", auth, async (req, res) => {
  const { petId, message } = req.body;
  if (!petId) return res.status(400).json({ msg: "petId required" });
  try {
    const pet = await Pet.findById(petId);
    if (!pet) return res.status(404).json({ msg: "Pet not found" });

    // Prevent duplicate requests by the same user for the same pet
    const existing = await AdoptionRequest.findOne({
      pet: petId,
      user: req.user._id,
    });
    if (existing)
      return res
        .status(400)
        .json({ msg: "You already submitted a request for this pet" });

    const doc = await AdoptionRequest.create({
      user: req.user._id,
      pet: petId,
      message,
    });
    // populate explicitly to avoid chaining issues and expose useful data
    await doc.populate("user", "name email");
    await doc.populate("pet", "name species");

    // Send confirmation email to requester (non-blocking)
    try {
      const emailContent = emailTemplates.getAdoptionRequestConfirmation(
        doc.user.name,
        doc.pet.name,
        message,
      );
      const mailResult = await mailer.sendMail({
        to: doc.user.email,
        subject: `Adoption Request Confirmed for ${doc.pet.name}`,
        text: emailContent,
      });
      // Attach preview URL to response during development (Ethereal only)
      if (mailResult && mailResult.preview) {
        const resp = { ...doc.toObject(), mailPreview: mailResult.preview };
        return res.json(resp);
      }
    } catch (emailErr) {
      console.error("Failed to send adoption confirmation email:", emailErr);
      // Don't throw—request is already saved, email is just a notification
    }

    res.json(doc);
  } catch (err) {
    console.error("Adoptions POST error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// List adoption requests: admin sees all, users see their own
router.get("/", auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== "admin") filter.user = req.user._id;
    const list = await AdoptionRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("pet", "name species");
    res.json(list);
  } catch (err) {
    console.error("Adoptions GET error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Admin: update adoption request status (approve/reject)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Forbidden" });
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status))
    return res.status(400).json({ msg: "Invalid status" });

  try {
    const reqDoc = await AdoptionRequest.findById(req.params.id);
    if (!reqDoc) return res.status(404).json({ msg: "Request not found" });

    reqDoc.status = status;
    await reqDoc.save();

    // If approved, mark the pet as adopted and reject other pending requests
    if (status === "approved") {
      await Pet.findByIdAndUpdate(reqDoc.pet, { adopted: true });
      await AdoptionRequest.updateMany(
        { pet: reqDoc.pet, _id: { $ne: reqDoc._id }, status: "pending" },
        { status: "rejected" },
      );
    }

    await reqDoc.populate("user", "name email");
    await reqDoc.populate("pet", "name species adopted");
    // send notification email to requester about status change (if configured)
    try {
      const to = reqDoc.user.email;
      let emailContent;

      if (reqDoc.status === "approved") {
        emailContent = emailTemplates.getAdoptionApprovalEmail(
          reqDoc.user.name,
          reqDoc.pet.name,
        );
      } else if (reqDoc.status === "rejected") {
        emailContent = emailTemplates.getAdoptionRejectionEmail(
          reqDoc.user.name,
          reqDoc.pet.name,
        );
      } else {
        // For pending status (shouldn't normally happen, but handle it)
        emailContent = `Your adoption request status has been updated to: ${reqDoc.status}`;
      }

      const mailResult = await mailer.sendMail({
        to,
        subject: `Adoption Request ${reqDoc.status.charAt(0).toUpperCase() + reqDoc.status.slice(1)} - ${reqDoc.pet.name}`,
        text: emailContent,
      });
      // attach preview URL to response during development/testing when available
      if (mailResult && mailResult.preview) {
        const resp = { ...reqDoc.toObject(), mailPreview: mailResult.preview };
        return res.json(resp);
      }
    } catch (err) {
      console.error("Failed to send status email:", err);
    }
    res.json(reqDoc);
  } catch (err) {
    console.error("Adoptions PUT error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
