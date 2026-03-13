const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Place = require("../models/Place");
const multer = require('multer');

// Configure multer for memory storage (temporary fix)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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
router.post("/", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 6 }
]), async (req, res) => {
  try {
    console.log("[adminPlacesRoutes] POST /api/admin/places - Creating new place");
    console.log("[adminPlacesRoutes] Request body:", req.body);
    console.log("[adminPlacesRoutes] Request headers:", req.headers);
    console.log("[adminPlacesRoutes] Request files:", req.files);
    console.log("[adminPlacesRoutes] Request content-type:", req.get('Content-Type'));
    
    const { name, location, category, description, bestTime, temperature, rating, isActive, placesToVisit, nearbyFacilities, howToReach } = req.body;
    
    // Handle file uploads - save to public/uploads directory
    let imageUrl = '';
    let imageGallery = [];
    
    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Handle main image
    if (req.files && req.files.image && req.files.image[0]) {
      const mainImage = req.files.image[0];
      const mainImageName = `place-${Date.now()}-main${path.extname(mainImage.originalname)}`;
      const mainImagePath = path.join(uploadsDir, mainImageName);
      
      // Write file to uploads directory
      fs.writeFileSync(mainImagePath, mainImage.buffer);
      imageUrl = `/uploads/${mainImageName}`;
    }
    
    // Handle gallery images
    if (req.files && req.files.images) {
      imageGallery = req.files.images.map((file, index) => {
        const galleryImageName = `place-${Date.now()}-gallery-${index}${path.extname(file.originalname)}`;
        const galleryImagePath = path.join(uploadsDir, galleryImageName);
        
        // Write file to uploads directory
        fs.writeFileSync(galleryImagePath, file.buffer);
        return `/uploads/${galleryImageName}`;
      });
    }
    
    // If no images uploaded, use placeholders
    if (!imageUrl) {
      imageUrl = `https://picsum.photos/seed/place-${Date.now()}/400/300.jpg`;
    }
    if (imageGallery.length === 0) {
      for (let i = 0; i < 3; i++) {
        imageGallery.push(`https://picsum.photos/seed/gallery-${Date.now()}-${i}/400/300.jpg`);
      }
    }
    
    const newPlace = new Place({
      name,
      location,
      image: imageUrl,
      images: imageGallery,
      category,
      description,
      bestTime,
      temperature,
      rating: rating || 0,
      isActive: isActive !== undefined ? isActive === 'true' : true,
      placesToVisit: placesToVisit ? placesToVisit.split('\n').filter(p => p.trim()) : [],
      nearbyFacilities: nearbyFacilities ? nearbyFacilities.split('\n').filter(f => f.trim()) : [],
      howToReach: howToReach || ''
    });

    console.log("[adminPlacesRoutes] Saving new place...");
    const savedPlace = await newPlace.save({ timeout: 30000 }); // 30 second timeout
    console.log("[adminPlacesRoutes] Place saved successfully:", savedPlace._id);
    res.status(201).json(savedPlace);
  } catch (error) {
    console.error("[adminPlacesRoutes] Error creating place:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update place
router.put("/:id", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 6 }
]), async (req, res) => {
  try {
    const { name, location, category, description, bestTime, temperature, rating, isActive, placesToVisit, nearbyFacilities, howToReach, existingImage, existingImages } = req.body;
    
    // Get the existing place to preserve old images if no new ones are uploaded
    const existingPlace = await Place.findById(req.params.id);
    if (!existingPlace) {
      return res.status(404).json({ message: "Place not found" });
    }
    
    // Handle file uploads (temporary - using placeholder URLs)
    let imageUrl = existingImage || existingPlace.image || `https://picsum.photos/seed/place-${Date.now()}/400/300.jpg`;
    let imageGallery = existingImages ? JSON.parse(existingImages) : existingPlace.images;
    
    // Ensure we always have gallery images
    if (!imageGallery || imageGallery.length === 0) {
      imageGallery = [];
      for (let i = 0; i < 3; i++) {
        imageGallery.push(`https://picsum.photos/seed/gallery-${Date.now()}-${i}/400/300.jpg`);
      }
    }
    
    if (req.files && req.files.image && req.files.image[0]) {
      imageUrl = `https://picsum.photos/seed/place-${Date.now()}/400/300.jpg`;
    }
    
    if (req.files && req.files.images) {
      imageGallery = req.files.images.map((file, index) => 
        `https://picsum.photos/seed/gallery-${Date.now()}-${index}/400/300.jpg`
      );
    }
    
    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        location, 
        image: imageUrl,
        images: imageGallery,
        category, 
        description, 
        bestTime, 
        temperature,
        rating: rating || 0,
        isActive: isActive !== undefined ? isActive === 'true' : true,
        placesToVisit: placesToVisit ? placesToVisit.split('\n').filter(p => p.trim()) : [],
        nearbyFacilities: nearbyFacilities ? nearbyFacilities.split('\n').filter(f => f.trim()) : [],
        howToReach: howToReach || ''
      },
      { new: true, runValidators: true }
    );

    res.json(updatedPlace);
  } catch (error) {
    console.error("[adminPlacesRoutes] Error updating place:", error);
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
