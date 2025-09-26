const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors()); // allow all origins for now
app.use(express.json());

// MongoDB connection
const mongoURL = process.env.MONGO_URI;
mongoose
  .connect(mongoURL)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Flexible Schema
const CollegeSchema = new mongoose.Schema({}, { strict: false });
const College = mongoose.model("College", CollegeSchema);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is working!");
});

// Stats endpoint
app.get("/stats", async (req, res) => {
  try {
    const totalColleges = await College.countDocuments();
    const availableSeats = totalColleges * 100;
    res.json({ totalColleges, availableSeats, topCollege: "JNTU Kakinada" });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Colleges API
app.get("/colleges", async (req, res) => {
  try {
    let { rank, branch, category, district, region } = req.query;
    rank = rank ? parseInt(rank) : 10000;
    branch = branch || "ALL";
    category = category || "ALL";
    district = district || "ALL";
    region = region || "ALL";

    const filter = {};
    if (branch !== "ALL") filter.branch_code = branch;
    if (district !== "ALL") filter.DIST = district;
    if (region !== "ALL") filter.REG = region;

    let colleges = await College.find(filter).lean();

   colleges = colleges.map((c) => {
      const cutoff = category !== "ALL" ? c.cutoffs?.[category] : null;
      return { ...c, selected_cutoff: cutoff };
    });

    if (category !== "ALL") {
      colleges = colleges.filter(
        (c) =>
          c.selected_cutoff &&
          c.selected_cutoff >= 1 &&
          c.selected_cutoff <= rank + 15000
      );
    }


    const uniqueColleges = [];
    const seen = new Set();
    colleges.forEach((c) => {
      const key = c.INSTCODE + "_" + c.branch_code;
      if (!seen.has(key)) {
        uniqueColleges.push(c);
        seen.add(key);
      }
    });

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

// Dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
