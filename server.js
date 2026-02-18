// 1️⃣ IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 2️⃣ APP INIT
const app = express();
const PORT = 5000;

// 3️⃣ MIDDLEWARE
app.use(cors());
app.use(express.json());

// 4️⃣ MONGODB CONNECTION
mongoose
  .connect(process.env.MONGO_URI) // no extra options needed
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error ❌", err));

// 5️⃣ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// 6️⃣ OTHER ROUTES
const placesRoutes = require("./routes/placesRoutes");
app.use("/api/places", placesRoutes);

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// 7️⃣ START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
