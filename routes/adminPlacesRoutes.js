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
  console.log("🔍 ROUTE HIT: POST /api/admin/places");
  console.log("🔍 Request body keys:", Object.keys(req.body || {}));
  console.log("🔍 Files received:", req.files ? Object.keys(req.files) : 'none');
  
  try {
    const { name, location, category, description, bestTime, temperature, rating, isActive, placesToVisit, nearbyFacilities, howToReach } = req.body;
    
    console.log("🔍 Form data received:", { name, location, category });
    
    // TEMPORARILY USE PLACEHOLDER IMAGES TO TEST BASIC FUNCTIONALITY
    let imageUrl = "";
    let imageGallery = [];
    
    // SIMPLE TEST: Always use a unique placeholder to see if the issue is with Cloudinary or frontend
    const uniqueId = Date.now() + Math.random().toString(36).substring(7);
    
    if (req.files && req.files.image && req.files.image[0]) {
      console.log("🔍 Main image received:", req.files.image[0].originalname, req.files.image[0].mimetype, req.files.image[0].size);
      
      // TEST: Use unique placeholder to verify frontend is updating correctly
      imageUrl = `https://picsum.photos/seed/${uniqueId}-main/400/300.jpg`;
      console.log("🔍 Using UNIQUE placeholder for main image:", imageUrl);
      
      // TEMPORARILY DISABLE CLOUDINARY TO ISOLATE THE ISSUE
      console.log("🔍 Cloudinary upload temporarily disabled for testing");
      
      /*
      // Convert Buffer to data URI for Cloudinary upload
      const fileBuffer = req.files.image[0].buffer;
      const dataURI = `data:${req.files.image[0].mimetype};base64,${fileBuffer.toString('base64')}`;
      
      console.log("🔍 Main image details:", {
        originalname: req.files.image[0].originalname,
        mimetype: req.files.image[0].mimetype,
        size: req.files.image[0].size,
        bufferLength: req.files.image[0].buffer.length,
        dataURIPrefix: dataURI.substring(0, 50) + "..."
      });
      
      try {
        console.log("🔍 Uploading main image to Cloudinary...");
        console.log("🔍 Cloudinary config check:", {
          cloud_name: cloudinary.config().cloud_name,
          api_key: cloudinary.config().api_key ? 'SET' : 'MISSING'
        });
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'tourist-places',
          resource_type: 'auto',
        });
        
        imageUrl = result.secure_url;
        console.log("🔍 Main image uploaded successfully:", imageUrl);
        console.log("🔍 Cloudinary result:", {
          public_id: result.public_id,
          secure_url: result.secure_url,
          format: result.format
        });
      } catch (cloudinaryError) {
        console.error("🔍 Cloudinary main image error:", cloudinaryError);
        console.error("🔍 Cloudinary error details:", {
          message: cloudinaryError.message,
          name: cloudinaryError.name,
          stack: cloudinaryError.stack
        });
        
        // Use placeholder as fallback
        imageUrl = `https://picsum.photos/seed/place-${Date.now()}/400/300.jpg`;
        console.log("🔍 Using fallback placeholder for main image:", imageUrl);
      }
      */
    }
    
    if (req.files && req.files.images) {
      const galleryFiles = req.files.images;
      console.log("🔍 Gallery images received:", galleryFiles.length);
      
      // TEST: Use unique placeholders to verify frontend is updating correctly
      for (let i = 0; i < galleryFiles.length; i++) {
        if (galleryFiles[i]) {
          const uniqueGalleryUrl = `https://picsum.photos/seed/${uniqueId}-gallery-${i}/400/300.jpg`;
          imageGallery.push(uniqueGalleryUrl);
          console.log(`🔍 Using UNIQUE placeholder for gallery image ${i + 1}:`, uniqueGalleryUrl);
        }
      }
      
      // TEMPORARILY DISABLE CLOUDINARY TO ISOLATE THE ISSUE
      console.log("🔍 Cloudinary gallery upload temporarily disabled for testing");
      
      /*
      for (let i = 0; i < galleryFiles.length; i++) {
        if (galleryFiles[i]) {
          const fileBuffer = galleryFiles[i].buffer;
          const dataURI = `data:${galleryFiles[i].mimetype};base64,${fileBuffer.toString('base64')}`;
          
          console.log(`🔍 Gallery image ${i + 1} details:`, {
            originalname: galleryFiles[i].originalname,
            mimetype: galleryFiles[i].mimetype,
            size: galleryFiles[i].size,
            bufferLength: galleryFiles[i].buffer.length,
            dataURIPrefix: dataURI.substring(0, 50) + "..."
          });
          
          try {
            console.log(`🔍 Uploading gallery image ${i + 1} to Cloudinary...`);
            const result = await cloudinary.uploader.upload(dataURI, {
              folder: 'tourist-places/gallery',
              resource_type: 'auto',
            });
            
            imageGallery.push(result.secure_url);
            console.log(`🔍 Gallery image ${i + 1} uploaded successfully:`, result.secure_url);
            console.log(`🔍 Gallery image ${i + 1} Cloudinary result:`, {
              public_id: result.public_id,
              secure_url: result.secure_url,
              format: result.format
            });
          } catch (cloudinaryError) {
            console.error(`🔍 Cloudinary gallery image ${i + 1} error:`, cloudinaryError);
            console.error(`🔍 Gallery image ${i + 1} error details:`, {
              message: cloudinaryError.message,
              name: cloudinaryError.name,
              stack: cloudinaryError.stack
            });
            
            // Use placeholder as fallback
            imageGallery.push(`https://picsum.photos/seed/gallery-${Date.now()}-${i}/400/300.jpg`);
            console.log(`🔍 Using fallback placeholder for gallery image ${i + 1}`);
          }
        }
      }
      */
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
      images: imageGallery
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
    const { name, location, category, description, bestTime, temperature, rating, isActive, placesToVisit, nearbyFacilities, howToReach, existingImage, existingImages } = req.body;
    
    console.log("[adminPlacesRoutes] PUT request - updating place:", req.params.id);
    
    // Get the existing place to preserve old images if no new ones are uploaded
    const existingPlace = await Place.findById(req.params.id);
    if (!existingPlace) {
      return res.status(404).json({ message: "Place not found" });
    }
    
    let imageUrl = existingImage || existingPlace.image || "";
    let imageGallery = existingImages ? JSON.parse(existingImages) : existingPlace.images || [];

    // Replace image with newly uploaded one via CloudinaryStorage
    if (req.files && req.files.image && req.files.image[0]) {
      imageUrl = req.files.image[0].path;
    }

    if (req.files && req.files.images) {
      const galleryFiles = req.files.images;
      const newGalleryImages = [];
      for (let i = 0; i < galleryFiles.length; i++) {
        if (galleryFiles[i] && galleryFiles[i].path) {
          newGalleryImages.push(galleryFiles[i].path);
        }
      }
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
