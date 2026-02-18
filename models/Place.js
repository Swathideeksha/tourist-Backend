const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: String,
  location: String,
  image: String,
  description: String,
});

module.exports = mongoose.model("Place", placeSchema);
