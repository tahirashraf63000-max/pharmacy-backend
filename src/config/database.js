const mongoose = require("mongoose");

class Database {
  async connect() {
    try {
      const uri = process.env.MONGO_URL;
      await mongoose.connect(uri);
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    }
  }
}

module.exports = new Database();
