const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
