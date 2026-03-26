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
    
    // Add coordinates to console for debugging
    console.log("[PLACES] Found places with coordinates:", places.map(p => ({
      name: p.name,
      latitude: p.latitude,
      longitude: p.longitude,
      hasCoordinates: !!(p.latitude && p.longitude),
      isValidCoordinates: !!(p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude))
    })));
    
    // Filter and log places with valid coordinates
    const validCoordinatePlaces = places.filter(place => 
      place.latitude && place.longitude && !isNaN(place.latitude) && !isNaN(place.longitude)
    );
    
    console.log("[PLACES] Places with valid coordinates for map:", validCoordinatePlaces.length);
    console.log("[PLACES] Valid coordinate places:", validCoordinatePlaces.map(p => ({
      name: p.name,
      lat: p.latitude,
      lng: p.longitude
    })));
    
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

// POST /api/places/add-coordinates - Add sample coordinates to existing places
router.post("/add-coordinates", async (req, res) => {
  try {
    console.log("[PLACES] Adding coordinates to existing places...");
    
    // Sample coordinates for Karnataka tourist places
    const sampleCoordinates = [
      { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
      { name: "Mysore", latitude: 12.2958, longitude: 76.6394 },
      { name: "Hampi", latitude: 15.3350, longitude: 76.4600 },
      { name: "Coorg", latitude: 12.4104, longitude: 75.7394 },
      { name: "Gokarna", latitude: 14.5433, longitude: 74.3206 },
      { name: "Chikmagalur", latitude: 13.3168, longitude: 75.7737 },
      { name: "Udupi", latitude: 13.3409, longitude: 74.7421 },
      { name: "Murudeshwar", latitude: 14.0949, longitude: 74.4855 },
      { name: "Jog Falls", latitude: 14.2313, longitude: 74.8239 },
      { name: "Badami", latitude: 15.9150, longitude: 75.6789 }
    ];
    
    const places = await Place.find({});
    let updatedCount = 0;
    
    for (const place of places) {
      // Try to match by place name (case-insensitive)
      const coordinates = sampleCoordinates.find(coord => 
        place.name.toLowerCase().includes(coord.name.toLowerCase()) ||
        coord.name.toLowerCase().includes(place.name.toLowerCase())
      );
      
      if (coordinates && (!place.latitude || !place.longitude)) {
        place.latitude = coordinates.latitude;
        place.longitude = coordinates.longitude;
        await place.save();
        console.log(`[PLACES] Updated coordinates for: ${place.name} -> [${coordinates.latitude}, ${coordinates.longitude}]`);
        updatedCount++;
      }
    }
    
    console.log(`[PLACES] Updated ${updatedCount} places with coordinates`);
    res.json({ 
      message: `Added coordinates to ${updatedCount} places`,
      updatedCount 
    });
  } catch (error) {
    console.error("Add coordinates error:", error);
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
