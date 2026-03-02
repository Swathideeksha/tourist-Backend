const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

// GET all places (with optional category filter)
router.get("/", async (req, res) => {
  try {
    console.log("[PLACES] GET request received, query:", req.query);
    const { category } = req.query;
    let query = {};
    
    if (category && category !== "all") {
      query.category = category;
    }
    
    const places = await Place.find(query).sort({ createdAt: -1 });
    console.log("[PLACES] Found", places.length, "places for category:", category || "all");
    
    // Map image to img for frontend compatibility
    const mappedPlaces = places.map(place => ({
      ...place.toObject(),
      img: place.image || place.img
    }));
    
    res.json(mappedPlaces);
  } catch (error) {
    console.error("Get places error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single place by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the ID is a valid MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid place ID" });
    }
    
    const place = await Place.findById(id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (error) {
    console.error("Get place error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/places/:id/like - Toggle like on a place
router.put("/:id/like", async (req, res) => {
  try {
    const { liked } = req.body;
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    
    // Increment or decrement savedCount based on liked status
    if (liked) {
      place.savedCount += 1;
    } else {
      place.savedCount = Math.max(0, place.savedCount - 1);
    }
    
    await place.save();
    res.json({ savedCount: place.savedCount });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
