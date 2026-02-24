const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "karnataka-tourism-admin-secret-key";

// Middleware to verify admin token
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// POST /api/admin/login - Admin login (supports username OR email)
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Accept either username or email for login
    // If username contains '@', treat it as email
    let loginField = email || username;
    if (!loginField) {
      return res.status(400).json({ message: "Please provide username or email and password" });
    }

    // Check if loginField looks like an email
    const isEmail = loginField.includes('@');
    
    // Find admin by username OR email
    const query = isEmail 
      ? { email: loginField.toLowerCase() } 
      : { $or: [{ username: loginField }, { email: loginField.toLowerCase() }] };
    
    const admin = await Admin.findOne(query);

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/register - Register first admin (should be disabled in production)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new Admin({ username, email, password });
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/check - Check if admin exists
router.get("/check", async (req, res) => {
  try {
    const admin = await Admin.findOne({});
    res.json({ exists: !!admin, username: admin?.username, email: admin?.email });
  } catch (error) {
    console.error("Check admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/create - Create admin without checking (for setup)
router.post("/create", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email and password" });
    }

    // Force create - delete existing if any
    await Admin.deleteMany({});

    const admin = new Admin({ username, email, password });
    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      }
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// GET /api/admin/me - Get current admin
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Get admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
