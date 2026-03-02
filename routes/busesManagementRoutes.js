const express = require("express");
const router = express.Router();
const Bus = require("../models/Bus");

// GET /api/buses-management - Get all buses
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    console.error("Get buses error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/buses-management/:id - Get single bus
router.get("/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch (error) {
    console.error("Get bus error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/buses-management - Create new bus
router.post("/", async (req, res) => {
  try {
    console.log("[BUSES-MANAGEMENT] POST request received:", req.body);
    const { name, type, model, image, images, capacity, safetyGear, engine, contact, address, amenities, rating, reviewsCount, isActive } = req.body;

    const bus = new Bus({
      name,
      type,
      model,
      image,
      images: images || [],
      capacity,
      safetyGear,
      engine,
      contact,
      address,
      amenities: amenities || [],
      rating: rating || 0,
      reviewsCount: reviewsCount || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await bus.save();
    console.log("[BUSES-MANAGEMENT] Bus saved successfully:", bus._id, "Name:", bus.name);
    res.status(201).json(bus);
  } catch (error) {
    console.error("Create bus error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/buses-management/:id - Update bus
router.put("/:id", async (req, res) => {
  try {
    const { name, type, model, image, images, capacity, safetyGear, engine, contact, address, amenities, rating, reviewsCount, isActive } = req.body;

    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        model,
        image,
        images: images || [],
        capacity,
        safetyGear,
        engine,
        contact,
        address,
        amenities: amenities || [],
        rating,
        reviewsCount,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(bus);
  } catch (error) {
    console.error("Update bus error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/buses-management/:id - Delete bus
router.delete("/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Delete bus error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/buses-management/stats/summary - Get buses summary
router.get("/stats/summary", async (req, res) => {
  try {
    const totalBuses = await Bus.countDocuments();
    const byType = await Bus.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    res.json({
      totalBuses,
      byType,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
