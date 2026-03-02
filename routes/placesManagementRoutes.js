const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

// GET /api/places-management - Get all places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    console.error("Get places error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/places-management/:id - Get single place
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    console.error("Get place error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/places-management - Create new place
router.post("/", async (req, res) => {
  try {
    console.log("[PLACES-MANAGEMENT] POST request received:", req.body);
    const { name, location, description, category, image, images, rating, reviewsCount, savedCount, isActive, placesToVisit, nearbyFacilities, howToReach } = req.body;

    const place = new Place({
      name,
      location,
      description,
      category,
      image,
      images: images || [],
      rating: rating || 0,
      reviewsCount: reviewsCount || 0,
      savedCount: savedCount || 0,
      isActive: isActive !== undefined ? isActive : true,
      placesToVisit: placesToVisit || [],
      nearbyFacilities: nearbyFacilities || [],
      howToReach: howToReach || "",
    });

    await place.save();
    console.log("[PLACES-MANAGEMENT] Place saved successfully:", place._id, "Name:", place.name, "Category:", place.category);
    res.status(201).json(place);
  } catch (error) {
    console.error("Create place error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/places-management/:id - Update place
router.put("/:id", async (req, res) => {
  try {
    const { name, location, description, category, image, images, rating, reviewsCount, savedCount, isActive, placesToVisit, nearbyFacilities, howToReach } = req.body;

    const place = await Place.findByIdAndUpdate(
      req.params.id,
      {
        name,
        location,
        description,
        category,
        image,
        images: images || [],
        rating,
        reviewsCount,
        savedCount,
        isActive,
        placesToVisit: placesToVisit || [],
        nearbyFacilities: nearbyFacilities || [],
        howToReach: howToReach || "",
      },
      { new: true, runValidators: true }
    );

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json(place);
  } catch (error) {
    console.error("Update place error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/places-management/:id - Delete place
router.delete("/:id", async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error("Delete place error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/places-management/stats/summary - Get places summary
router.get("/stats/summary", async (req, res) => {
  try {
    const totalPlaces = await Place.countDocuments();
    
    // Sum up all savedCount values to get total likes
    const placesWithLikes = await Place.aggregate([
      { $group: { _id: null, totalLikes: { $sum: "$savedCount" } } }
    ]);
    const totalSaved = placesWithLikes.length > 0 ? placesWithLikes[0].totalLikes : 0;
    
    const byCategory = await Place.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json({
      totalPlaces,
      totalSaved,
      byCategory,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
