const mongoose = require("mongoose");
require("dotenv").config();

// Load MongoDB model
const Interview = require("./models/interview");

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/yourdbname", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Fetch and display interviews
    return Interview.find();
  })
  .then((interviews) => {
    console.log("Stored Interviews:", interviews);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB or fetch interviews", err);
  });
