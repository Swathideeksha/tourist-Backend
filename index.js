const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const adminRoutes = require("./routes/adminRoutes");
const placesRoutes = require("./routes/placesRoutes");
const placesManagementRoutes = require("./routes/placesManagementRoutes");
const busesManagementRoutes = require("./routes/busesManagementRoutes");
const Place = require("./models/Place");
const Bus = require("./models/Bus");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sushswathi:swathisush1716@cluster0.5bvhfb0.mongodb.net/?appName=Cluster0";

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error ❌", err));
}

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// Admin routes
app.use("/api/admin", adminRoutes);

// Places routes (public)
app.use("/api/places", placesRoutes);

// Places management routes
app.use("/api/places-management", placesManagementRoutes);

// Public buses route (for user-facing pages - no auth required)
app.get("/api/buses", async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    // Map image to img for frontend compatibility
    const mappedBuses = buses.map(bus => ({
      ...bus.toObject(),
      img: bus.image || bus.img
    }));
    res.json(mappedBuses);
  } catch (error) {
    console.error("Get buses error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Buses management routes (requires auth)
app.use("/api/buses-management", busesManagementRoutes);

// Seed route
app.post("/api/seed", async (req, res) => {
  try {
    const placesData = [
      { name: "Sakleshpur", location: "Hassan", description: "A scenic hill town in Karnataka", category: "hill-station", image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800" },
      { name: "Coorg", location: "Kodagu", description: "Known as the Scotland of India", category: "hill-station", image: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=800" },
      { name: "Chikmagalur", location: "Chikmagalur", description: "Coffee plantations and mountains", category: "hill-station", image: "https://images.unsplash.com/photo-1545696968-1a5245650b36?w=800" },
      { name: "Agumbe", location: "Shivamogga", description: "Cherrapunji of the South", category: "hill-station", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800" },
      { name: "Nandi Hills", location: "Chikkaballapura", description: "Hill station near Bengaluru", category: "hill-station", image: "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800" },
      { name: "Kapu Beach", location: "Udupi", description: "Beautiful beach with lighthouse", category: "beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
      { name: "Malpe Beach", location: "Udupi", description: "Golden sand beach", category: "beach", image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800" },
      { name: "Om Beach", location: "Gokarna", description: "Beach shaped like Om symbol", category: "beach", image: "https://images.unsplash.com/photo-1455729552865-3658a5d39692?w=800" },
      { name: "Hampi", location: "Vijayanagara", description: "UNESCO World Heritage Site", category: "history", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800" },
      { name: "Mysore Palace", location: "Mysore", description: "Iconic royal palace", category: "history", image: "https://images.unsplash.com/photo-1589740734696-133c3013e036?w=800" },
      { name: "Murudeshwara", location: "Uttara Kannada", description: "Temple with Shiva statue", category: "religious", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800" },
      { name: "Mookambika Temple", location: "Kollur", description: "Sacred goddess temple", category: "religious", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800" },
    ];

    // Only add places that don't already exist (by name)
    let addedCount = 0;
    for (const placeData of placesData) {
      const existing = await Place.findOne({ name: placeData.name });
      if (!existing) {
        await Place.create(placeData);
        addedCount++;
      }
    }
    res.json({ message: `Successfully added ${addedCount} new places! (Existing places kept)` });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ message: "Error seeding database", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

// Export for Vercel
module.exports = app;

// Start server (only when not in serverless)
if (process.env.VERCEL !== "true") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
