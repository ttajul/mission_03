const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const tellMeAboutYourself = async (req, res) => {
  try {
    const prompt = `Ask the interview question "Tell me about yourself."`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const question = response.text();
    res.json({ question});
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const interviewQuestions = async (req, res) => {
  try {
    const { answer } = req.body;

    const prompt = `Give 6 next interview question based on ${answer}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions_6 = response.text();
    res.json({ questions_6 });
  } catch (error) {
    console.error("Error generating interview question 2:", error);
    res.status(500).json({ error: "An error occurred" });
  }}
  



const getFeedbackOnAnswer = async (req, res) => {
  try {
    const { interview_answer} = req.body;
    const prompt = `Provide feedback on the following answer: "${interview_answer}". Focus on how the answer could be improved in terms of clarity, relevance, and impact.`;
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
  tellMeAboutYourself,
  interviewQuestions,
  getFeedbackOnAnswer
};