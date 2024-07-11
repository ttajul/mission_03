const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"], // Email validation
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
