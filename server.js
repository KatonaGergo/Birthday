// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const dataFile = path.join(__dirname, "dates.json");

// Enable CORS for all origins (good for dev)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static frontend files from current directory
app.use(express.static(__dirname));

// POST endpoint to save dates
app.post("/save-dates", (req, res) => {
  const { birthday, metDate } = req.body;

  if (!birthday || !metDate) {
    return res.status(400).json({ error: "Missing dates" });
  }

  // Read existing data or start with empty array
  let data = [];
  if (fs.existsSync(dataFile)) {
    try {
      const raw = fs.readFileSync(dataFile);
      data = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to read JSON file:", err);
    }
  }

  // Add new entry with timestamp
  data.push({ birthday, metDate, timestamp: new Date().toISOString() });

  // Write back to file
  fs.writeFile(dataFile, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Failed to write JSON file:", err);
      return res.status(500).json({ error: "Failed to save data" });
    }
    console.log("Saved dates:", birthday, metDate);
    res.json({ success: true });
  });
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "legjobb.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
