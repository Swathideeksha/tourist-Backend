const express = require("express");
const router = express.Router();

// Dummy tourist places data
const places = [
  { id: 1, name: "Taj Mahal", city: "Agra", description: "Famous white marble monument" },
  { id: 2, name: "Red Fort", city: "Delhi", description: "Historic fort made of red sandstone" },
  { id: 3, name: "Qutub Minar", city: "Delhi", description: "Tallest brick minaret in the world" },
  { id: 4, name: "Gateway of India", city: "Mumbai", description: "Iconic arch overlooking the sea" }
];

// GET all places
router.get("/", (req, res) => {
  res.json(places);
});

// GET single place by id
router.get("/:id", (req, res) => {
  const place = places.find(p => p.id === parseInt(req.params.id));
  if (!place) return res.status(404).json({ message: "Place not found" });
  res.json(place);
});

module.exports = router;
