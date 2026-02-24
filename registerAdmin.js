const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB Connection
const MONGO_URI = "mongodb+srv://sushswathi:swathisush1716@cluster0.5bvhfb0.mongodb.net/?appName=Cluster0";

// Admin Schema (simplified without middleware)
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin"],
  },
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

const registerAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "explorekarnataka0@gmail.com" });
    
    if (existingAdmin) {
      console.log("⚠️ Admin with this email already exists!");
      await mongoose.disconnect();
      return;
    }

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("swathisush1716", salt);

    // Create admin user
    const admin = new Admin({
      username: "explorekarnataka",
      email: "explorekarnataka0@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin registered successfully!");
    console.log("📧 Email: explorekarnataka0@gmail.com");
    console.log("🔑 Password: swathisush1716");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

registerAdmin();
