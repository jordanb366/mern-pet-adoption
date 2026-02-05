const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User exists" });

    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user = await User.create({
      name,
      email,
      password: hash,
      verificationToken,
    });

    // Send verification email
    const verificationUrl = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/verify-email?token=${verificationToken}`;
    const mailResult = await sendMail({
      to: email,
      subject: "Verify Your Email - Pet Adoption App",
      text: `Hello ${name},\n\nPlease verify your email by clicking this link: ${verificationUrl}\n\nThanks,\nPet Adoption Team`,
    });

    const resp = {
      msg: "Registration successful. Please check your email to verify your account.",
    };
    if (mailResult && mailResult.preview) resp.mailPreview = mailResult.preview;
    res.json(resp);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(400)
        .json({ msg: "Please verify your email before logging in." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ msg: "Email verified successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;
    const mailResult = await sendMail({
      to: email,
      subject: "Password Reset - Pet Adoption App",
      text: `Hello ${user.name},\n\nClick this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nThanks,\nPet Adoption Team`,
    });

    const resp = { msg: "Password reset email sent." };
    if (mailResult && mailResult.preview) resp.mailPreview = mailResult.preview;
    res.json(resp);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ msg: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
