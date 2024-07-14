const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port:8080 });

const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(express.json());
app.use("/api", apiRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//routes
const aiRoutes = require('./routes/aiRoutes');

//endpoints
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api/ai', aiRoutes); 
app.post('/start-interview', async (req, res) => {
  const { jobTitle, company } = req.body;
  res.json({ message: 'Interview started' });
});

wss.on('connection', (ws) => {
  let prompt = '';
  let interviewData = [{ question: "Tell me about yourself.", answer: null }];

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    const { jobTitle, company, answer } = data;

    if (interviewData.length < 6) { // Limit to 5 questions
      if (interviewData.length === 1) { // First question
        prompt = `Generate an interview question for a ${jobTitle} position at ${company}. Start with "Tell me about yourself."`;
      } else {
        const lastQuestion = interviewData[interviewData.length - 1].question;
        prompt = `You are interviewing for a ${jobTitle} position at ${company}. The last question was: "${lastQuestion}". The candidate responded: "${answer}". Please ask the next interview question based on this information.`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const question = response.text().trim();

      interviewData.push({ question: question, answer: answer });

      ws.send(JSON.stringify({ question: question })); // Send next question
    } else {
      // End the interview 
      ws.send(JSON.stringify({ message: 'Interview complete' }));
    }
  });
});




const PORT = 3000; // Ensure this is set to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});



module.exports = app;

