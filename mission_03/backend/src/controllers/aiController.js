const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateStory = async (req, res) => {
  try {
    const prompt = req.query.prompt || "Write a story about an AI and magic"; 
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ story: text });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  generateStory
};