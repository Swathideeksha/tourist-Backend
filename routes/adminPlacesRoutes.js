const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Place = require("../models/Place");
const multer = require('multer');

// Configure multer for memory storage with better field handling
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Increase payload limit for JSON requests
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add middleware to handle both JSON and form data
router.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    // For multipart form data, multer will handle it
    next();
  } else if (req.is('application/json')) {
    // For JSON, body is already parsed
    next();
  } else {
    // Try to parse as URL-encoded
    express.urlencoded({ extended: true })(req, res, next);
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

// Add new place - handle both FormData and JSON with base64
router.post("/", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 6 }
]), async (req, res) => {
  try {
    console.log("[adminPlacesRoutes] POST /api/admin/places - Creating new place");
    console.log("[adminPlacesRoutes] Request body:", req.body);
    console.log("[adminPlacesRoutes] Request files:", req.files);
    
    // Handle both FormData and JSON with base64
    let imageUrl = '';
    let imageGallery = [];
    
    // Check if base64 images are sent in JSON (new method)
    if (req.body.mainImageBase64) {
      console.log("Processing base64 main image from JSON");
      imageUrl = req.body.mainImageBase64;
      console.log("Base64 main image length:", imageUrl.length);
    }
    
    if (req.body.galleryImagesBase64 && Array.isArray(req.body.galleryImagesBase64)) {
      console.log("Processing base64 gallery images from JSON");
      imageGallery = req.body.galleryImagesBase64;
      console.log("Base64 gallery images count:", imageGallery.length);
    }
    
    // Handle file uploads (old method - fallback)
    if (req.files && req.files.image && req.files.image[0] && !imageUrl) {
      const mainImage = req.files.image[0];
      console.log("Processing main image from file:", mainImage.originalname, mainImage.mimetype, mainImage.size);
      
      const base64Image = mainImage.buffer.toString('base64');
      const mimeType = mainImage.mimetype;
      imageUrl = `data:${mimeType};base64,${base64Image}`;
      console.log("File image converted to data URL, length:", imageUrl.length);
    }
    
    if (req.files && req.files.images && imageGallery.length === 0) {
      imageGallery = req.files.images.map((file, index) => {
        console.log(`Processing gallery image ${index} from file:`, file.originalname, file.mimetype, file.size);
        
        const base64Image = file.buffer.toString('base64');
        const mimeType = file.mimetype;
        const dataUrl = `data:${mimeType};base64,${base64Image}`;
        console.log(`File gallery image ${index} converted to data URL, length:`, dataUrl.length);
        return dataUrl;
      });
    }
    
    // If no images uploaded, use placeholders
    if (!imageUrl) {
      imageUrl = `https://picsum.photos/seed/place-${Date.now()}/400/300.jpg`;
      console.log("No main image provided, using placeholder");
    }
    if (imageGallery.length === 0) {
      for (let i = 0; i < 3; i++) {
        imageGallery.push(`https://picsum.photos/seed/gallery-${Date.now()}-${i}/400/300.jpg`);
      }
      console.log("No gallery images provided, using placeholders");
    }
    
    // Get form fields
    const { name, location, category, description, bestTime, temperature, rating, isActive, placesToVisit, nearbyFacilities, howToReach } = req.body;
    
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
