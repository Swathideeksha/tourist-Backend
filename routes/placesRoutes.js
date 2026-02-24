const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

// GET all places (with optional category filter)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    
    if (category && category !== "all") {
      query.category = category;
    }
    
    const places = await Place.find(query).sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    console.error("Get places error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single place by id
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
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
    
    // Set savedCount to 1 if liked, 0 if unliked
    // This tracks unique places that have been liked
    place.savedCount = liked ? 1 : 0;
    
    await place.save();
    res.json({ savedCount: place.savedCount });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
