const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobTitle, company } = req.body;
    const prompt = `Generate 5 interview questions for a ${jobTitle} position at ${company}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = response.text().split("\n");
    res.json({ questions });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getFeedbackOnAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const prompt = `Given the interview question "${question}", provide feedback on the following answer: "${answer}". Focus on how the answer could be improved in terms of clarity, relevance, and impact.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();
    res.json({ feedback });
  } catch (error) {
    console.error("Error getting feedback on answer:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  generateInterviewQuestions,
  getFeedbackOnAnswer
};