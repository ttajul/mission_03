const express = require("express");
const router = express.Router();
const Interview = require("../models/interview");

// Route to get all interviews
router.get("/interviews", async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
