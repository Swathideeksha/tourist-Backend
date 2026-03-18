const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Place = require("../models/Place");
const { cloudinary } = require("../config/cloudinary");
const multer = require('multer');

// Use regular multer for memory storage to handle both form fields and files
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Increase payload limit for JSON requests (handle larger base64 payloads)
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

// Add new place - handle FormData uploads
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 6 }]), async (req, res) => {
  console.log("🔍 BACKEND: POST route hit!");
  console.log("🔍 BACKEND: Request headers:", Object.fromEntries(req.headers.entries()));
  console.log("🔍 BACKEND: Content-Type:", req.get('Content-Type'));
  console.log("🔍 BACKEND: Content-Length:", req.get('Content-Length'));
  
  try {
    console.log("[adminPlacesRoutes] POST /api/admin/places - Creating new place");
    console.log("[adminPlacesRoutes] Request body:", req.body);
    console.log("[adminPlacesRoutes] Files received:", req.files ? Object.keys(req.files) : 'none');
    
    // TEMPORARILY SKIP ALL FILE PROCESSING TO TEST BASIC FUNCTIONALITY
    console.log("[adminPlacesRoutes] Skipping file processing for testing");
    
    // Get form fields from FormData
    const { name, location, category, description, bestTime, temperature, rating, isActive, placesToVisit, nearbyFacilities, howToReach } = req.body;
    
    console.log("[adminPlacesRoutes] Parsed form data:", {
      name,
      location,
      category,
      hasDescription: !!description,
      bestTime,
      isActive
    });
    
    // Create place with placeholder images (no file processing)
    const placeData = {
      name,
      location,
      category,
      description,
      bestTime,
      temperature,
      rating,
      isActive: isActive || 'true',
      placesToVisit: placesToVisit ? placesToVisit.split(',').map(p => p.trim()) : [],
      nearbyFacilities: nearbyFacilities ? nearbyFacilities.split(',').map(f => f.trim()) : [],
      howToReach: howToReach || '', // Keep as string, not array
      image: `https://picsum.photos/seed/place-${Date.now()}/400/300.jpg`,
      images: [
        `https://picsum.photos/seed/gallery-${Date.now()}-0/400/300.jpg`,
        `https://picsum.photos/seed/gallery-${Date.now()}-1/400/300.jpg`
      ]
    };
    
    console.log("[adminPlacesRoutes] Creating place with placeholder images:", { 
      ...placeData, 
      image: !!placeData.image, 
      images: placeData.images.length 
    });
    
    const newPlace = new Place(placeData);
    await newPlace.save();
    
    console.log("[adminPlacesRoutes] Place created successfully:", newPlace._id);
    console.log("[adminPlacesRoutes] Saved place image data:", {
      _id: newPlace._id,
      name: newPlace.name,
      image: newPlace.image,
      images: newPlace.images,
      imageType: typeof newPlace.image,
      imagesType: typeof newPlace.images,
      imagesLength: newPlace.images?.length || 0
    });
    
    res.status(201).json(newPlace);
    
  } catch (error) {
    console.error("[adminPlacesRoutes] Error creating place:", error);
    console.error("[adminPlacesRoutes] Error stack:", error.stack);
    console.error("[adminPlacesRoutes] Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    // Return detailed error for debugging
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      stack: error.stack,
      details: "Check Vercel function logs for complete error trace"
    });
  }
});

// Update place
router.put("/:id", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 6 }
]), async (req, res) => {
  try {
    const { name, location, category, description, bestTime, temperature, rating, isActive, placesToVisit, nearbyFacilities, howToReach, existingImage, existingImages } = req.body;
    
    console.log("[adminPlacesRoutes] PUT request - updating place:", req.params.id);
    console.log("[adminPlacesRoutes] Request body:", req.body);
    console.log("[adminPlacesRoutes] Files received:", req.files ? Object.keys(req.files) : 'none');
    
    // Get the existing place to preserve old images if no new ones are uploaded
    const existingPlace = await Place.findById(req.params.id);
    if (!existingPlace) {
      return res.status(404).json({ message: "Place not found" });
    }
    
    // Handle Cloudinary image uploads
    let imageUrl = existingImage || existingPlace.image || `https://picsum.photos/seed/place-${Date.now()}/400/300.jpg`;
    let imageGallery = existingImages ? JSON.parse(existingImages) : existingPlace.images;
    
    console.log("[adminPlacesRoutes] Existing images:", {
      mainImage: existingPlace.image,
      galleryImages: existingPlace.images
    });
    
    // Handle new main image uploaded to Cloudinary
    if (req.files && req.files.image && req.files.image[0]) {
      try {
        console.log("[adminPlacesRoutes] Processing new main image:", req.files.image[0].mimetype, req.files.image[0].size);
        
        // Convert Buffer to data URI for Cloudinary
        const fileBuffer = req.files.image[0].buffer;
        const dataURI = `data:${req.files.image[0].mimetype};base64,${fileBuffer.toString('base64')}`;
        
        console.log("[adminPlacesRoutes] Uploading new main image to Cloudinary...");
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'tourist-places',
          resource_type: 'auto',
        });
        imageUrl = result.secure_url;
        console.log("[adminPlacesRoutes] New main image uploaded to Cloudinary:", imageUrl);
      } catch (cloudinaryError) {
        console.error("[adminPlacesRoutes] Cloudinary main image error:", cloudinaryError);
        // Keep existing image if upload fails
      }
    }
    
    // Handle new gallery images uploaded to Cloudinary
    if (req.files && req.files.images) {
      const galleryFiles = req.files.images;
      console.log("[adminPlacesRoutes] Processing", galleryFiles.length, "new gallery images");
      
      const newGalleryImages = [];
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        if (file && file.buffer) {
          try {
            console.log(`[adminPlacesRoutes] Processing new gallery image ${i + 1}:`, file.mimetype, file.size);
            
            // Convert Buffer to data URI for Cloudinary
            const dataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            
            console.log(`[adminPlacesRoutes] Uploading new gallery image ${i + 1} to Cloudinary...`);
            const result = await cloudinary.uploader.upload(dataURI, {
              folder: 'tourist-places/gallery',
              resource_type: 'auto',
            });
            newGalleryImages.push(result.secure_url);
            console.log(`[adminPlacesRoutes] New gallery image ${i + 1} uploaded to Cloudinary:`, result.secure_url);
          } catch (cloudinaryError) {
            console.error(`[adminPlacesRoutes] Cloudinary gallery image ${i + 1} error:`, cloudinaryError);
            // Continue with next image
          }
        }
      }
      
      // Only replace gallery if new images were uploaded successfully
      if (newGalleryImages.length > 0) {
        imageGallery = newGalleryImages;
      }
    }
    
    // Ensure we always have gallery images
    if (!imageGallery || imageGallery.length === 0) {
      imageGallery = [];
      for (let i = 0; i < 3; i++) {
        imageGallery.push(`https://picsum.photos/seed/gallery-${Date.now()}-${i}/400/300.jpg`);
      }
    }
    
    console.log("[adminPlacesRoutes] Final images for update:", {
      mainImage: imageUrl,
      galleryImages: imageGallery
    });
    
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
