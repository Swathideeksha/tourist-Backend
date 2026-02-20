const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

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
