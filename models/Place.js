const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  img: { type: String },
  image: { type: String },
  category: { type: String, required: true, enum: ['beach', 'hill-station', 'history', 'religious'] },
  description: { type: String },
  images: [{ type: String }],
  bestTime: { type: String },
  temperature: { type: String },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  savedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Place || mongoose.model("Place", placeSchema);
