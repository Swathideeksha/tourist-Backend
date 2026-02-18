const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Contact form submission endpoint
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required" 
    });
  }

  // Log the contact message (for now, just log to console)
  // In production, you would store in database or send email
  console.log("\n=== NEW CONTACT MESSAGE ===");
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);
  console.log("============================\n");

  // Simulate successful sending
  res.status(200).json({ 
    success: true, 
    message: "Message sent successfully!" 
  });
});

module.exports = router;
