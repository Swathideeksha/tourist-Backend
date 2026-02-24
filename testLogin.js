const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB Connection
const MONGO_URI = "mongodb+srv://sushswathi:swathisush1716@cluster0.5bvhfb0.mongodb.net/?appName=Cluster0";

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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
  },
  role: {
    type: String,
    default: "admin",
  },
}, { timestamps: true });

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

const testLogin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Test login with email
    const email = "explorekarnataka0@gmail.com";
    const password = "swathisush1716";

    console.log(`\n🔍 Testing login with email: ${email}`);
    
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      console.log("❌ Admin not found with this email!");
      console.log("\n📋 All admins in database:");
      const allAdmins = await Admin.find({}).select("-password");
      console.log(allAdmins);
    } else {
      console.log("✅ Admin found!");
      console.log("📧 Email:", admin.email);
      console.log("👤 Username:", admin.username);
      
      const isMatch = await admin.comparePassword(password);
      console.log("🔑 Password match:", isMatch);
      
      if (!isMatch) {
        console.log("❌ Password is incorrect!");
      }
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
};

testLogin();
