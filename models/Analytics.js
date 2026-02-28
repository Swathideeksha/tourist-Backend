const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  pageViews: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
  placesVisited: {
    type: Number,
    default: 0,
  },
  busesViewed: {
    type: Number,
    default: 0,
  },
  contactMessages: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Compound index to ensure unique month/year combinations
analyticsSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Analytics", analyticsSchema);
