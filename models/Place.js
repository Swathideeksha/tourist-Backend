const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  img: { type: String },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['hill-station', 'beach', 'history', 'religious']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  bestTime: {
    type: String,
    trim: true
  },
  temperature: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewsCount: { type: Number, default: 0 },
  savedCount: { type: Number, default: 0 },
  latitude: {
    type: Number,
    required: false,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: false,
    min: -180,
    max: 180
  },
  isActive: {
    type: Boolean,
    default: true
  },
  placesToVisit: [{
    type: String
  }],
  nearbyFacilities: [{
    type: String
  }],
  howToReach: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Pre-save hook to generate slug from name
placeSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }
  next();
});

module.exports = mongoose.models.Place || mongoose.model("Place", placeSchema);
