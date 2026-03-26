const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String },
  model: { type: String },
  capacity: { type: String },
  safetyGear: { type: String },
  engine: { type: String },
  contact: { type: String },
  address: { type: String },
  website: { type: String },
  amenities: [{ type: String }],
  reviews: [{
    name: String,
    type: String,
    date: String,
    rating: Number,
    text: String
  }],
  travelInfo: [{ type: String }],
  overallRating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bus", busSchema);
