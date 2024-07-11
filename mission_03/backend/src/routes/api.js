const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Adjust the path as needed

// Define your routes here
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Export the router
module.exports = router;
