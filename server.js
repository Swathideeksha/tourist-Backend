// 1️⃣ IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 2️⃣ APP INIT
const app = express();
const PORT = process.env.PORT || 5000;

// 3️⃣ MIDDLEWARE
app.use(cors());
app.use(express.json());

// 4️⃣ MONGODB CONNECTION
// Always attempt to connect when MONGO_URI is present (works on serverless too)
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error ❌", err));
}

// 5️⃣ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// 6️⃣ OTHER ROUTES
const placesRoutes = require("./routes/placesRoutes");
app.use("/api/places", placesRoutes);

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// 7️⃣ EXPORT FOR VERCEL
module.exports = app;

// 8️⃣ START SERVER (only when not in serverless)
if (process.env.VERCEL !== "true") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
