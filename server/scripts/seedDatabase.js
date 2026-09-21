require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const User = require("../src/models/User");
const Pet = require("../src/models/Pet");
const AdoptionRequest = require("../src/models/AdoptionRequest");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

// Generate placeholder images for pets
const generatePlaceholderImages = async (petNames) => {
  const uploadsDir = path.join(__dirname, "..", "..", "uploads");

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Array of colors for variety
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B739",
    "#52B788",
    "#D62828",
    "#F77F00",
    "#FCBF49",
    "#EAE2B7",
    "#003049",
  ];

  const generateSVG = (name, color) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${color}"/>
  <text x="200" y="180" font-size="48" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
    🐾
  </text>
  <text x="200" y="260" font-size="64" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
    ${initials}
  </text>
  <text x="200" y="340" font-size="28" text-anchor="middle" fill="white" font-family="Arial, sans-serif">
    ${name}
  </text>
</svg>`;
  };

  try {
    petNames.forEach((name, index) => {
      const color = colors[index % colors.length];
      const svg = generateSVG(name, color);
      const filename = `${name.toLowerCase().replace(/\s+/g, "_")}.svg`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFileSync(filepath, svg);
      console.log(`✓ Generated placeholder image: ${filename}`);
    });

    console.log(`Generated ${petNames.length} placeholder images\n`);
  } catch (err) {
    console.error("Error generating placeholder images:", err);
    throw err;
  }
};

const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Pet.deleteMany({});
    await AdoptionRequest.deleteMany({});
    console.log("Database cleared");
  } catch (err) {
    console.error("Error clearing database:", err);
  }
};

const seedUsers = async () => {
  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "admin",
      isVerified: true,
    },
    {
      name: "John Smith",
      email: "john@example.com",
      password: await bcrypt.hash("User@123", 10),
      role: "user",
      isVerified: true,
    },
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: await bcrypt.hash("User@123", 10),
      role: "user",
      isVerified: true,
    },
    {
      name: "Mike Davis",
      email: "mike@example.com",
      password: await bcrypt.hash("User@123", 10),
      role: "user",
      isVerified: true,
    },
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      password: await bcrypt.hash("User@123", 10),
      role: "user",
      isVerified: true,
    },
    {
      name: "Robert Brown",
      email: "robert@example.com",
      password: await bcrypt.hash("User@123", 10),
      role: "user",
      isVerified: false,
    },
  ];

  try {
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    return createdUsers;
  } catch (err) {
    console.error("Error seeding users:", err);
    throw err;
  }
};

const seedPets = async () => {
  const pets = [
    {
      name: "Buddy",
      species: "Dog",
      type: "Golden Retriever",
      breed: "Golden Retriever",
      age: 3,
      description:
        "Friendly and energetic golden retriever who loves to play fetch and cuddle. Great with kids and other dogs. Trained in basic commands.",
      imageUrl: "/uploads/buddy.svg",
      location: "San Francisco, CA",
      adopted: false,
    },
    {
      name: "Whiskers",
      species: "Cat",
      type: "Persian",
      breed: "Persian",
      age: 2,
      description:
        "Calm and affectionate Persian cat. Prefers quiet environments and loves to be petted. Indoor cat only.",
      imageUrl: "/uploads/whiskers.svg",
      location: "New York, NY",
      adopted: false,
    },
    {
      name: "Max",
      species: "Dog",
      type: "German Shepherd",
      breed: "German Shepherd",
      age: 5,
      description:
        "Intelligent and loyal German Shepherd. Well-trained and protective. Needs an active family with a backyard.",
      imageUrl: "/uploads/max.svg",
      location: "Los Angeles, CA",
      adopted: false,
    },
    {
      name: "Luna",
      species: "Cat",
      type: "Siamese",
      breed: "Siamese",
      age: 1,
      description:
        "Playful and vocal Siamese kitten. Very social and enjoys interactive play. Perfect for active families.",
      imageUrl: "/uploads/luna.svg",
      location: "Chicago, IL",
      adopted: false,
    },
    {
      name: "Charlie",
      species: "Dog",
      type: "Labrador",
      breed: "Labrador Retriever",
      age: 4,
      description:
        "Gentle and food-motivated Labrador. Great for training. Loves swimming and outdoor activities.",
      imageUrl: "/uploads/charlie.svg",
      location: "Boston, MA",
      adopted: false,
    },
    {
      name: "Mittens",
      species: "Cat",
      type: "Tabby",
      breed: "Tabby Mix",
      age: 3,
      description:
        "Sweet tabby cat who loves sunbathing and lap time. Gets along well with other cats. Microchipped.",
      imageUrl: "/uploads/mittens.svg",
      location: "Seattle, WA",
      adopted: false,
    },
    {
      name: "Daisy",
      species: "Dog",
      type: "Beagle",
      breed: "Beagle",
      age: 2,
      description:
        "Curious and food-loving Beagle puppy. Needs training and exercise. Great nose for adventures!",
      imageUrl: "/uploads/daisy.svg",
      location: "Denver, CO",
      adopted: false,
    },
    {
      name: "Shadow",
      species: "Cat",
      type: "Black Domestic",
      breed: "Domestic Shorthair",
      age: 6,
      description:
        "Mysterious black cat with green eyes. Independent but affectionate on their own terms. Good mouser.",
      imageUrl: "/uploads/shadow.svg",
      location: "Austin, TX",
      adopted: false,
    },
    {
      name: "Rocky",
      species: "Dog",
      type: "Boxer",
      breed: "Boxer",
      age: 3,
      description:
        "Playful and muscular Boxer. Needs experienced handler. Loves playtime and is very protective of family.",
      imageUrl: "/uploads/rocky.svg",
      location: "Miami, FL",
      adopted: false,
    },
    {
      name: "Bella",
      species: "Cat",
      type: "Bengal",
      breed: "Bengal Mix",
      age: 2,
      description:
        "Energetic Bengal-mix cat with exotic spots. Highly intelligent and athletic. Needs enrichment toys.",
      imageUrl: "/uploads/bella.svg",
      location: "Portland, OR",
      adopted: false,
    },
  ];

  try {
    const createdPets = await Pet.insertMany(pets);
    console.log(`${createdPets.length} pets created`);
    return createdPets;
  } catch (err) {
    console.error("Error seeding pets:", err);
    throw err;
  }
};

const seedAdoptionRequests = async (users, pets) => {
  const adoptionRequests = [
    {
      user: users[1]._id, // John
      pet: pets[0]._id, // Buddy
      message:
        "I have a large backyard and would love to give Buddy a forever home.",
      status: "pending",
    },
    {
      user: users[2]._id, // Sarah
      pet: pets[1]._id, // Whiskers
      message: "Perfect apartment pet. I'll provide lots of love and care.",
      status: "pending",
    },
    {
      user: users[3]._id, // Mike
      pet: pets[2]._id, // Max
      message: "Former dog trainer here. Ready for an intelligent dog.",
      status: "approved",
    },
    {
      user: users[1]._id, // John
      pet: pets[3]._id, // Luna
      message: "Would love a playful kitten to join our family.",
      status: "rejected",
    },
    {
      user: users[4]._id, // Emma
      pet: pets[4]._id, // Charlie
      message: "Family of four, looking for a friendly companion.",
      status: "pending",
    },
    {
      user: users[2]._id, // Sarah
      pet: pets[5]._id, // Mittens
      message: "Have another cat at home. They should get along well.",
      status: "pending",
    },
    {
      user: users[3]._id, // Mike
      pet: pets[6]._id, // Daisy
      message: "Happy to train and care for a beagle puppy.",
      status: "approved",
    },
  ];

  try {
    const createdRequests = await AdoptionRequest.insertMany(adoptionRequests);
    console.log(`${createdRequests.length} adoption requests created`);
    return createdRequests;
  } catch (err) {
    console.error("Error seeding adoption requests:", err);
    throw err;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();

    console.log("\n🌱 Starting database seeding...\n");

    // Generate placeholder images first
    const petNames = [
      "Buddy",
      "Whiskers",
      "Max",
      "Luna",
      "Charlie",
      "Mittens",
      "Daisy",
      "Shadow",
      "Rocky",
      "Bella",
    ];
    await generatePlaceholderImages(petNames);

    const users = await seedUsers();
    const pets = await seedPets();
    await seedAdoptionRequests(users, pets);

    // Add some favorite pets to users
    users[1].favorites.push(pets[0]._id, pets[1]._id);
    users[2].favorites.push(pets[2]._id);
    users[3].favorites.push(pets[4]._id, pets[6]._id);
    await users[1].save();
    await users[2].save();
    await users[3].save();
    console.log("User favorites added");

    console.log("\n✅ Database seeding completed successfully!\n");
    console.log("📋 Seeded Data Summary:");
    console.log(`   • ${users.length} users`);
    console.log(`   • ${pets.length} pets`);
    console.log(`   • 7 adoption requests`);
    console.log("\n🔑 Test Credentials:");
    console.log("   Admin: admin@example.com / Admin@123");
    console.log("   User:  john@example.com / User@123");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDatabase();
