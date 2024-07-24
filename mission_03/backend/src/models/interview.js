const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  jobTitle: String,
  company: String,
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Interview", interviewSchema);
