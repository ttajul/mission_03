const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Interview = require("../models/interview");
const aiService = require("../services/aiservice.js");

// Define your routes here
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!password) {
    return res.status(400).send({ message: "Password is required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  const isMatch = password === user.password;
  if (!isMatch) {
    return res.status(401).send({ message: "Invalid credentials" });
  }
  res.send({ message: "Login successful", token: "your-token" });
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(404).send({ message: "User not found" });
  }
});

router.post("/ai/generate-question", async (req, res) => {
  try {
    const question = await aiService.generateQuestion();
    res.send({ question });
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
});

// New route to get all interview data
router.get("/interviews", async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interview data" });
  }
});

// Export the router
module.exports = router;
