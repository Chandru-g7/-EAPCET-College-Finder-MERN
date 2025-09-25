const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const mongoURL = "mongodb+srv://chandu_eapcet:chandu775@eapcet775-college-finder.1vafffp.mongodb.net/Eapcet_college_finder?retryWrites=true&w=majority";
mongoose.connect(mongoURL)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.log(err));

// Schema (flexible)
const CollegeSchema = new mongoose.Schema({}, { strict: false });
const College = mongoose.model("College", CollegeSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// API route to filter colleges
app.get("/colleges", async (req, res) => {
  try {
    let { rank, category, region, district } = req.query;

    // Default values if missing
    rank = rank ? parseInt(rank) : 10000;
    category = category || "OC_BOYS";
    region = region || "ALL";
    district = district || "ALL";

    const filter = {};
    if (region !== "ALL") filter.A_REG = region;
    if (district !== "ALL") filter.DIST = district;

    // Get colleges matching region/district
    const colleges = await College.find(filter);

    // Filter by cutoff rank
    const result = colleges.filter(c => {
      const cutoff = c.cutoffs?.[category];
      return cutoff && cutoff <= rank + 5000; // rank + 5000
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
