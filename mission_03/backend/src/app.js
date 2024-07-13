const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();



// Middleware
app.use(express.json());
app.use("/api", apiRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//AI initialization
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// Database connection
if (process.env.NODE_ENV !== "test") {
  mongoose.connect("mongodb://localhost:27017/yourdbname", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const PORT = 3000; // Ensure this is set to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

async function run() {
  const prompt = "Write a story about a AI and magic"

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
module.exports = app;

