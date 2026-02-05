const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: String,
    type: String,
    breed: String,
    age: Number,
    description: String,
    photo: String,
    location: String,
    imageUrl: String,
    adopted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", PetSchema);
