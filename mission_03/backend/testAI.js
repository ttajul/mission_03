const { GoogleGenerativeAI: TestGoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const testGenAI = new TestGoogleGenerativeAI(process.env.API_KEY);
const testModel = testGenAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const testPrompt = async () => {
  const prompt =
    "You are interviewing for a software engineer position. Please generate the next interview question.";
  try {
    const result = await testModel.generateContent(prompt);
    console.log("Full AI result object:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error during AI prompt generation:", error);
  }
};

testPrompt();
