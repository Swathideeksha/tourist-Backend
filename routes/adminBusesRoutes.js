const express = require("express");
const router = express.Router();
const Bus = require("../models/Bus");

// Get all buses from database
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single bus
router.get("/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add new bus
router.post("/", async (req, res) => {
  try {
    const { 
      name, type, image, model, capacity, safetyGear, engine, 
      contact, address, amenities, reviews, travelInfo, overallRating 
    } = req.body;
    
    const newBus = new Bus({
      name,
      type,
      image,
      model,
      capacity,
      safetyGear,
      engine,
      contact,
      address,
      amenities: amenities || [],
      reviews: reviews || [],
      travelInfo: travelInfo || [],
      overallRating: overallRating || 0,
      reviewsCount: reviews ? reviews.length : 0
    });

    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update bus
router.put("/:id", async (req, res) => {
  try {
    const { 
      name, type, image, model, capacity, safetyGear, engine, 
      contact, address, amenities, reviews, travelInfo, overallRating 
    } = req.body;
    
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      {
        name, type, image, model, capacity, safetyGear, engine,
        contact, address, amenities, reviews, travelInfo, overallRating,
        reviewsCount: reviews ? reviews.length : 0
      },
      { new: true, runValidators: true }
    );

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(updatedBus);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete bus
router.delete("/:id", async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    
    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
