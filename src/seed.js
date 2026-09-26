/**
 * Seeds a default admin user and a couple of categories so the system
 * can be logged into immediately after setup.
 *
 * Usage: npm run seed
 */
require("dotenv").config();
const database = require("./config/database");
const User = require("./models/User");
const Category = require("./models/Category");

async function seed() {
  await database.connect();

  const adminEmail = "admin@pharmacy.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: "System Admin",
      email: adminEmail,
      password: "Admin@123",
      role: "admin",
      status: "active",
    });
    console.log(`Admin user created: ${adminEmail} / Admin@123`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  const defaultCategories = ["Pain Relief", "Antibiotics", "Vitamins", "Cold & Flu", "Digestive", "Skin Care"];
  for (const name of defaultCategories) {
    const exists = await Category.findOne({ name });
    if (!exists) await Category.create({ name });
  }
  console.log("Default categories ensured.");

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
