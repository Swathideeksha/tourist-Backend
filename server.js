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
app.use(express.static('public'));

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

// Seed route for populating database
const seedPlaces = require("./seedPlaces");
app.post("/api/seed", async (req, res) => {
  try {
    await seedPlaces.seedPlaces();
    res.json({ message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error seeding database", error: error.message });
  }
});

// 6️⃣ OTHER ROUTES
const placesRoutes = require("./routes/placesRoutes");
app.use("/api/places", placesRoutes);

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// Admin routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const adminPlacesRoutes = require("./routes/adminPlacesRoutes");
app.use("/api/admin/places", adminPlacesRoutes);

const adminBusesRoutes = require("./routes/adminBusesRoutes");
app.use("/api/admin/buses", adminBusesRoutes);

// Places management routes
const placesManagementRoutes = require("./routes/placesManagementRoutes");
app.use("/api/places-management", placesManagementRoutes);

// Buses management routes
const busesManagementRoutes = require("./routes/busesManagementRoutes");
app.use("/api/buses-management", busesManagementRoutes);

// Analytics routes
const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/api/analytics", analyticsRoutes);

// 7️⃣ EXPORT FOR VERCEL
module.exports = app;

// 8️⃣ START SERVER (only when not in serverless)
if (process.env.VERCEL !== "true") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
