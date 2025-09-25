// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
const mongoURL = process.env.MONGO_URI || "your_local_fallback_url";
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Flexible Schema (to accept all fields)
const CollegeSchema = new mongoose.Schema({}, { strict: false });
const College = mongoose.model("College", CollegeSchema);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is working!");
});

// Colleges API
app.get("/colleges", async (req, res) => {
  try {
    let { rank, branch, category, district, region } = req.query;

    // Default values
    rank = rank ? parseInt(rank) : 10000;
    branch = branch || "ALL";
    category = category || "ALL";
    district = district || "ALL";
    region = region || "ALL";

    // MongoDB filters
    const filter = {};
    if (branch !== "ALL") filter.branch_code = branch;
    if (district !== "ALL") filter.DIST = district;
    if (region !== "ALL") filter.REG = region;

    // Fetch colleges
    let colleges = await College.find(filter).lean();

    // Add cutoff for selected category
    colleges = colleges.map((c) => {
      const cutoff = category !== "ALL" ? c.cutoffs?.[category] : null;
      return { ...c, selected_cutoff: cutoff };
    });

    // Apply cutoff filtering (rank → rank+5000)
    if (category !== "ALL") {
      colleges = colleges.filter(
        (c) =>
          c.selected_cutoff &&
          c.selected_cutoff >= rank && // greater than or equal to user rank
          c.selected_cutoff <= rank + 5000 // within +5000 range
      );
    }

    // Deduplicate college-branch entries
    const uniqueColleges = [];
    const seen = new Set();
    colleges.forEach((c) => {
      const key = c.INSTCODE + "_" + c.branch_code;
      if (!seen.has(key)) {
        uniqueColleges.push(c);
        seen.add(key);
      }
    });

    // Sort ascending by cutoff
    uniqueColleges.sort((a, b) => {
      if (!a.selected_cutoff) return 1;
      if (!b.selected_cutoff) return -1;
      return a.selected_cutoff - b.selected_cutoff;
    });

    res.json(uniqueColleges);
  } catch (err) {
    console.error("❌ Error fetching colleges:", err);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
