const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetToken: String,
    resetTokenExpiry: Date,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
