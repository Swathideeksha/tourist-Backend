const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const { cloudinary } = require("../config/cloudinary");
const multer = require('multer');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 6 }]), async (req, res) => {
  try {
    console.log("[PLACES-MANAGEMENT] POST request received");
    let imageUrl = "";
    let imageGallery = [];

    if (req.files && req.files.image && req.files.image[0]) {
      try {
        const fileBuffer = req.files.image[0].buffer;
        const dataURI = `data:${req.files.image[0].mimetype};base64,${fileBuffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'tourist-places',
          resource_type: 'auto',
        });
        imageUrl = result.secure_url;
      } catch (err) {
        console.error("Cloudinary main image error:", err);
      }
    }

    if (req.files && req.files.images) {
      const galleryFiles = req.files.images;
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        if (file && file.buffer) {
          try {
            const dataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(dataURI, {
              folder: 'tourist-places/gallery',
              resource_type: 'auto',
            });
            imageGallery.push(result.secure_url);
          } catch (err) {
            console.error(`Cloudinary gallery image ${i + 1} error:`, err);
          }
        }
      }
    }

    const { name, location, description, category, rating, reviewsCount, savedCount, isActive, placesToVisit, nearbyFacilities, howToReach } = req.body;

    const place = new Place({
      name,
      location,
      description,
      category,
      image: imageUrl,
      images: imageGallery,
      rating: rating || 0,
      reviewsCount: reviewsCount || 0,
      savedCount: savedCount || 0,
      isActive: isActive !== undefined ? isActive === 'true' : true,
      placesToVisit: placesToVisit ? placesToVisit.split('\n').filter(p => p.trim()) : [],
      nearbyFacilities: nearbyFacilities ? nearbyFacilities.split('\n').filter(p => p.trim()) : [],
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
router.put("/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 6 }]), async (req, res) => {
  try {
    const { name, location, description, category, rating, reviewsCount, savedCount, isActive, placesToVisit, nearbyFacilities, howToReach, existingImage, existingImages } = req.body;

    let imageUrl = existingImage || "";
    let imageGallery = existingImages ? JSON.parse(existingImages) : [];

    if (req.files && req.files.image && req.files.image[0]) {
      try {
        const fileBuffer = req.files.image[0].buffer;
        const dataURI = `data:${req.files.image[0].mimetype};base64,${fileBuffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'tourist-places',
          resource_type: 'auto',
        });
        imageUrl = result.secure_url;
      } catch (err) {
        console.error("Cloudinary main image error:", err);
      }
    }

    if (req.files && req.files.images) {
      const galleryFiles = req.files.images;
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        if (file && file.buffer) {
          try {
            const dataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(dataURI, {
              folder: 'tourist-places/gallery',
              resource_type: 'auto',
            });
            imageGallery.push(result.secure_url);
          } catch (err) {
            console.error(`Cloudinary gallery image ${i + 1} error:`, err);
          }
        }
      }
    }

    const place = await Place.findByIdAndUpdate(
      req.params.id,
      {
        name,
        location,
        description,
        category,
        image: imageUrl,
        images: imageGallery,
        rating: rating || 0,
        reviewsCount: reviewsCount || 0,
        savedCount: savedCount || 0,
        isActive: isActive !== undefined ? isActive === 'true' : true,
        placesToVisit: placesToVisit ? placesToVisit.split('\n').filter(p => p.trim()) : [],
        nearbyFacilities: nearbyFacilities ? nearbyFacilities.split('\n').filter(p => p.trim()) : [],
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
