const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//routes
const aiRoutes = require("./src/routes/aiRoutes");
app.use("/api", aiRoutes);

const PORT = 3000; // Ensure this is set to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = app;
