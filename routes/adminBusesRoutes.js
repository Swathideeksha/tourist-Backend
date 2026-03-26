const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");
const Bus = require("../models/Bus");

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all buses from database
router.get("/", async (req, res) => {
  try {
    console.log("[adminBusesRoutes] GET /api/admin/buses - Fetching buses");
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log("[adminBusesRoutes] MongoDB not connected, readyState:", mongoose.connection.readyState);
      if (mongoose.connection.readyState === 0 && process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("[adminBusesRoutes] MongoDB reconnected");
      }
    }
    
    const buses = await Bus.find().sort({ createdAt: -1 });
    console.log("[adminBusesRoutes] Found buses:", buses.length);
    res.json(buses);
  } catch (error) {
    console.error("[adminBusesRoutes] Error fetching buses:", error);
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

// Add new bus with image upload
router.post("/", upload.single('image'), async (req, res) => {
  try {
    console.log("[adminBusesRoutes] POST /api/admin/buses - Creating new bus");
    console.log("[adminBusesRoutes] Request body:", req.body);
    console.log("[adminBusesRoutes] Request file:", req.file ? req.file.originalname : 'No file');
    
    const { 
      name, type, model, capacity, safetyGear, engine, 
      contact, address, amenities, travelInfo 
    } = req.body;
    
    let imageUrl = "";
    
    // Handle image upload to Cloudinary
    if (req.file) {
      console.log("[adminBusesRoutes] Image received:", req.file.originalname);
      
      // Convert Buffer to data URI for Cloudinary upload
      const fileBuffer = req.file.buffer;
      const dataURI = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
      
      try {
        console.log("[adminBusesRoutes] Uploading image to Cloudinary...");
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'tourist-buses',
          resource_type: 'auto',
        });
        
        imageUrl = result.secure_url;
        console.log("[adminBusesRoutes] Image uploaded successfully:", imageUrl);
      } catch (cloudinaryError) {
        console.error("[adminBusesRoutes] Cloudinary upload error:", cloudinaryError);
        // Use placeholder image if Cloudinary fails
        imageUrl = `https://picsum.photos/seed/bus${Date.now()}/400/300.jpg`;
      }
    } else {
      // Use placeholder image if no file uploaded
      imageUrl = `https://picsum.photos/seed/bus${Date.now()}/400/300.jpg`;
      console.log("[adminBusesRoutes] No image file received, using placeholder");
    }
    
    const newBus = new Bus({
      name,
      type,
      image: imageUrl,
      model,
      capacity,
      safetyGear,
      engine,
      contact,
      address,
      amenities: amenities ? amenities.split(',').map(a => a.trim()).filter(a => a) : [],
      travelInfo: travelInfo ? travelInfo.split(',').map(t => t.trim()).filter(t => t) : [],
      overallRating: 0,
      reviewsCount: 0
    });

    const savedBus = await newBus.save();
    console.log("[adminBusesRoutes] Bus created successfully:", savedBus._id);
    res.status(201).json(savedBus);
  } catch (error) {
    console.error("[adminBusesRoutes] Error creating bus:", error);
    console.error("[adminBusesRoutes] Error stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update bus with image upload
router.put("/:id", upload.single('image'), async (req, res) => {
  try {
    console.log("[adminBusesRoutes] PUT /api/admin/buses - Updating bus");
    
    const { 
      name, type, model, capacity, safetyGear, engine, 
      contact, address, amenities, travelInfo 
    } = req.body;
    
    // Get existing bus
    const existingBus = await Bus.findById(req.params.id);
    if (!existingBus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    
    let imageUrl = existingBus.image; // Keep existing image by default
    
    // Handle new image upload to Cloudinary
    if (req.file) {
      console.log("[adminBusesRoutes] New image received for update:", req.file.originalname);
      
      // Convert Buffer to data URI for Cloudinary upload
      const fileBuffer = req.file.buffer;
      const dataURI = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
      
      try {
        console.log("[adminBusesRoutes] Uploading new image to Cloudinary...");
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'tourist-buses',
          resource_type: 'auto',
        });
        
        imageUrl = result.secure_url;
        console.log("[adminBusesRoutes] New image uploaded successfully:", imageUrl);
      } catch (cloudinaryError) {
        console.error("[adminBusesRoutes] Cloudinary upload error:", cloudinaryError);
        // Keep existing image if upload fails
      }
    }
    
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      {
        name, 
        type, 
        image: imageUrl,
        model, 
        capacity, 
        safetyGear, 
        engine,
        contact, 
        address, 
        amenities: amenities ? amenities.split(',').map(a => a.trim()).filter(a => a) : [],
        travelInfo: travelInfo ? travelInfo.split(',').map(t => t.trim()).filter(t => t) : [],
        reviewsCount: existingBus.reviewsCount || 0
      },
      { new: true, runValidators: true }
    );

    console.log("[adminBusesRoutes] Bus updated successfully:", updatedBus._id);
    res.json(updatedBus);
  } catch (error) {
    console.error("[adminBusesRoutes] Error updating bus:", error);
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

    console.log("[adminBusesRoutes] Bus deleted successfully:", deletedBus._id);
    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("[adminBusesRoutes] Error deleting bus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
