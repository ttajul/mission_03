const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api"); // Adjust the path as needed

const app = express();

// Middleware
app.use(express.json());
app.use("/api", apiRoutes); // Use the routes

// Database connection
if (process.env.NODE_ENV !== "test") {
  // Prevent connecting to DB during tests
  mongoose.connect("mongodb://localhost:27017/yourdbname", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = app;
