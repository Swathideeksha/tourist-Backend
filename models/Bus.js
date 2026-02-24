const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["PREMIUM SERVICES", "LUXURY SERVICES", "SEMI LUXURY", "EXPRESS", "ORDINARY"],
  },
  model: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  images: [{
    type: String,
  }],
  capacity: {
    type: Number,
    required: true,
  },
  safetyGear: {
    type: String,
    default: "Standard",
  },
  engine: {
    type: String,
    default: "BS6",
  },
  contact: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  amenities: [{
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
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);
