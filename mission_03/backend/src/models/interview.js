const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  name: String,
  jobTitle: String,
  company: String,
  question: String,
  answer: String,
  date: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Interview", interviewSchema);
