require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

async function main() {
  const MONGO =
    process.env.MONGO_URI || "mongodb://localhost:27017/pet_adoption";
  await mongoose.connect(MONGO);
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "password123";
  const name = process.env.ADMIN_NAME || "Admin";

  let user = await User.findOne({ email });
  if (user) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    password: hash,
    role: "admin",
    isVerified: true,
  });
  console.log("Created admin user:", email);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
