const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Place = require("../models/Place");

// Get all places from database
router.get("/", async (req, res) => {
  try {
    console.log("[adminPlacesRoutes] GET /api/admin/places - Fetching places");
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log("[adminPlacesRoutes] MongoDB not connected, readyState:", mongoose.connection.readyState);
      // Try to reconnect
      if (mongoose.connection.readyState === 0 && process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("[adminPlacesRoutes] MongoDB reconnected");
      }
    }
    
    const places = await Place.find().sort({ createdAt: -1 });
    console.log("[adminPlacesRoutes] Found places:", places.length);
    res.json(places);
  } catch (error) {
    console.error("[adminPlacesRoutes] Error fetching places:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single place
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add new place
router.post("/", async (req, res) => {
  try {
    const { name, location, img, image, category, description, images, bestTime, temperature } = req.body;
    
    const newPlace = new Place({
      name,
      location,
      img: img || image, // Accept both img and image
      image: image || img,
      category,
      description,
      images: images || [],
      bestTime,
      temperature
    });

    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update place
router.put("/:id", async (req, res) => {
  try {
    const { name, location, img, image, category, description, images, bestTime, temperature } = req.body;
    
    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      { name, location, img: img || image, image: image || img, category, description, images, bestTime, temperature },
      { new: true, runValidators: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json(updatedPlace);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete place
router.delete("/:id", async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    
    if (!deletedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
