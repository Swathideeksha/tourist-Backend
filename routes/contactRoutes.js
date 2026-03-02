const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

// GET /api/contact - Get all messages (for admin)
router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
});

// POST /api/contact/contact - Store message in MongoDB
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const doc = await ContactMessage.create({ name, email, message });
    return res.status(200).json({ success: true, message: "Message stored successfully!", id: doc._id });
  } catch (err) {
    console.error("Error saving contact message:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to store message. Please try again later." });
  }
});

module.exports = router;
