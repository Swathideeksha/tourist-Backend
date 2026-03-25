const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Place = require("../models/Place");
const { cloudinary, storage } = require("../config/cloudinary");
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
    
    // Debug coordinates for each place
    places.forEach((place, index) => {
      console.log(`[adminPlacesRoutes] Place ${index + 1}:`, {
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        hasCoordinates: !!(place.latitude && place.longitude),
        latType: typeof place.latitude,
        lngType: typeof place.longitude
      });
    });
    
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
router.post("/", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 6 }
]), async (req, res) => {
  console.log("🔍 ROUTE HIT: POST /api/admin/places");
  console.log("🔍 Request body keys:", Object.keys(req.body || {}));
  console.log("🔍 Files received:", req.files ? Object.keys(req.files) : 'none');
  
  try {
    const { name, location, category, description, bestTime, temperature, rating, isActive, placesToVisit, nearbyFacilities, howToReach, latitude, longitude } = req.body;
    
    console.log("🔍 Form data received:", { name, location, category });
    console.log("🔍 Coordinates received:", { latitude, longitude, latType: typeof latitude, lngType: typeof longitude });
    
    // Upload images to Cloudinary with fallback handling
    let imageUrl = "";
    let imageGallery = [];
    
    if (req.files && req.files.image && req.files.image[0]) {
      console.log("🔍 Main image received:", req.files.image[0].originalname, req.files.image[0].mimetype, req.files.image[0].size);
      
      // Convert Buffer to data URI for Cloudinary upload
      const fileBuffer = req.files.image[0].buffer;
      const dataURI = `data:${req.files.image[0].mimetype};base64,${fileBuffer.toString('base64')}`;
      
      console.log("🔍 Uploading main image to Cloudinary...");
      
      try {
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'tourist-places',
          resource_type: 'auto',
        });
        
        imageUrl = result.secure_url;
        console.log("🔍 Main image uploaded successfully:", imageUrl);
      } catch (cloudinaryError) {
        console.error("🔍 Cloudinary main image error:", cloudinaryError);
        console.error("🔍 Cloudinary error details:", {
          message: cloudinaryError.message,
          name: cloudinaryError.name,
          http_code: cloudinaryError.http_code
        });
        
        // Return a more user-friendly error message
        return res.status(500).json({ 
          message: "Cloudinary configuration error. Please check your Cloudinary API keys.", 
          error: "Image upload failed due to invalid Cloudinary credentials. Please update your environment variables.",
          details: cloudinaryError.message
        });
      }
    }
    
    if (req.files && req.files.images) {
      const galleryFiles = req.files.images;
      console.log("🔍 Gallery images received:", galleryFiles.length);
      
      for (let i = 0; i < galleryFiles.length; i++) {
        if (galleryFiles[i]) {
          const fileBuffer = galleryFiles[i].buffer;
          const dataURI = `data:${galleryFiles[i].mimetype};base64,${fileBuffer.toString('base64')}`;
          
          try {
            console.log(`🔍 Uploading gallery image ${i + 1} to Cloudinary...`);
            const result = await cloudinary.uploader.upload(dataURI, {
              folder: 'tourist-places/gallery',
              resource_type: 'auto',
            });
            
            imageGallery.push(result.secure_url);
            console.log(`🔍 Gallery image ${i + 1} uploaded successfully:`, result.secure_url);
          } catch (cloudinaryError) {
            console.error(`🔍 Cloudinary gallery image ${i + 1} error:`, cloudinaryError);
            return res.status(500).json({ 
              message: `Failed to upload gallery image ${i + 1}`, 
              error: "Cloudinary configuration error. Please check your Cloudinary API keys.",
              details: cloudinaryError.message
            });
          }
        }
      }
      console.log("🔍 Final gallery images count:", imageGallery.length);
    }
    
    const place = new Place({
      name,
      location,
      category,
      description,
      bestTime,
      temperature,
      rating: rating || 0,
      isActive: isActive !== undefined ? isActive === 'true' : true,
      placesToVisit: placesToVisit ? placesToVisit.split(',').map(p => p.trim()) : [],
      nearbyFacilities: nearbyFacilities ? nearbyFacilities.split(',').map(p => p.trim()) : [],
      howToReach: howToReach || "",
      image: imageUrl,
      images: imageGallery,
      latitude: parseFloat(req.body.latitude) || null,
      longitude: parseFloat(req.body.longitude) || null
    });
    
    console.log("🔍 Saving place to database...");
    await place.save();
    console.log("🔍 Place saved successfully:", place._id);
    
    res.status(201).json(place);
  } catch (error) {
    console.error("🔍 Error creating place:", error);
    console.error("🔍 Error stack:", error.stack);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message
    });
  }
});

// Update place
router.put("/:id", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 6 }
]), async (req, res) => {
  try {
    const { name, location, category, description, bestTime, temperature, rating, isActive, placesToVisit, nearbyFacilities, howToReach, existingImage, existingImages, latitude, longitude } = req.body;
    
    console.log("[adminPlacesRoutes] PUT request - updating place:", req.params.id);
    console.log("[adminPlacesRoutes] Received coordinates:", { latitude, longitude });
    
    // Get the existing place with timeout handling
    let existingPlace;
    try {
      existingPlace = await Place.findById(req.params.id).maxTimeMS(15000); // 15 second timeout
      if (!existingPlace) {
        return res.status(404).json({ message: "Place not found" });
      }
    } catch (dbError) {
      console.error("[adminPlacesRoutes] Database error finding place:", dbError);
      return res.status(500).json({ 
        message: "Database error", 
        error: "Unable to find place. Please try again." 
      });
    }
    
    let imageUrl = existingImage || existingPlace.image || "";
    let imageGallery = existingImages ? JSON.parse(existingImages) : existingPlace.images || [];

    // Handle new image uploads to Cloudinary
    if (req.files && req.files.image && req.files.image[0]) {
      const fileBuffer = req.files.image[0].buffer;
      const dataURI = `data:${req.files.image[0].mimetype};base64,${fileBuffer.toString('base64')}`;
      
      try {
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'tourist-places',
          resource_type: 'auto',
        });
        imageUrl = result.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary main image error:", cloudinaryError);
        return res.status(500).json({ 
          message: "Failed to upload main image", 
          error: cloudinaryError.message 
        });
      }
    }

    if (req.files && req.files.images) {
      const galleryFiles = req.files.images;
      const newGalleryImages = [];
      
      for (let i = 0; i < galleryFiles.length; i++) {
        if (galleryFiles[i]) {
          const fileBuffer = galleryFiles[i].buffer;
          const dataURI = `data:${galleryFiles[i].mimetype};base64,${fileBuffer.toString('base64')}`;
          
          try {
            const result = await cloudinary.uploader.upload(dataURI, {
              folder: 'tourist-places/gallery',
              resource_type: 'auto',
            });
            newGalleryImages.push(result.secure_url);
          } catch (cloudinaryError) {
            console.error(`Cloudinary gallery image ${i + 1} error:`, cloudinaryError);
            return res.status(500).json({ 
              message: `Failed to upload gallery image ${i + 1}`, 
              error: cloudinaryError.message 
            });
          }
        }
      }
      
      if (newGalleryImages.length > 0) {
        imageGallery = newGalleryImages;
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
        howToReach: howToReach || '',
        latitude: latitude ? parseFloat(latitude) : existingPlace.latitude,
        longitude: longitude ? parseFloat(longitude) : existingPlace.longitude
      },
      { new: true, runValidators: true, maxTimeMS: 15000 }
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
