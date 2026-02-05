require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

async function main() {
  const MONGO =
    process.env.MONGO_URI || "mongodb://localhost:27017/pet_adoption";
  await mongoose.connect(MONGO);
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const newPassword = process.env.ADMIN_PASSWORD || "password123";
  const user = await User.findOne({ email });
  if (!user) {
    console.error("Admin user not found:", email);
    process.exit(1);
  }
  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  user.role = "admin";
  user.isVerified = true;
  await user.save();
  console.log("Updated admin password for", email);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
