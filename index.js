const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
