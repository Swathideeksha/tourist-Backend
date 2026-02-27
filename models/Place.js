const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["beach", "hill-station", "history", "religious"],
  },
  image: {
    type: String,
    default: "",
  },
  images: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  savedCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  placesToVisit: [{
    type: String,
  }],
  nearbyFacilities: [{
    type: String,
  }],
}, { timestamps: true });

module.exports = mongoose.models.Place || mongoose.model("Place", placeSchema);
