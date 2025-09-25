const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://chandu_eapcet:chandu775@eapcet775-college-finder.1vafffp.mongodb.net/Eapcet_college_finder?retryWrites=true&w=majority";

mongoose.connect(mongoURL)
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
