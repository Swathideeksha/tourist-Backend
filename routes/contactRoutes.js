const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Create a reusable transporter using SMTP settings from environment variables
function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com"; // default to Gmail SMTP if not provided
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER; // fallback to legacy vars if provided
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      "SMTP credentials missing. Please set SMTP_USER/SMTP_PASS (or EMAIL_USER/EMAIL_PASS) and optionally SMTP_HOST/SMTP_PORT."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for port 465, false otherwise
    auth: { user, pass },
  });
}

// POST /api/contact/contact
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const transporter = createTransporter();

    const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;

    const mailOptions = {
      from: fromAddr,
      to: "explorekarnataka0@gmail.com",
      replyTo: email,
      subject: `New support message from ${name}`,
      text: `New message from Explore Karnataka contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
          <h2>New Support Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-line">${message}</p>
          <hr/>
          <p style="font-size:12px;color:#666">This email was sent from the Explore Karnataka contact form.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error sending contact email:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send message. Please try again later." });
  }
});

module.exports = router;
