const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");
const aiRoutes = require("./routes/aiRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const WebSocket = require("ws");

// WebSocket server setup
const wssPort = process.env.WS_PORT || 8097;
const wss = new WebSocket.Server({ port: wssPort });

// Middleware setup
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Load environment variables
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Use routes
app.use("/api", apiRoutes);
app.use("/api/ai", aiRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/start-interview", async (req, res) => {
  const { jobTitle, company } = req.body;
  res.json({ message: "Interview started" });
});

// WebSocket connection
wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  let prompt = "";
  let interviewData = [{ question: "Tell me about yourself.", answer: null }];

  ws.on("message", async (message) => {
    console.log("Received message:", message);

    try {
      const data = JSON.parse(message);
      const { jobTitle, company, answer } = data;

      if (interviewData.length < 6) {
        if (interviewData.length === 1) {
          prompt = `Generate an interview question for a ${jobTitle} position at ${company}. Start with "Tell me about yourself."`;
        } else {
          const lastQuestion = interviewData[interviewData.length - 1].question;
          prompt = `You are interviewing for a ${jobTitle} position at ${company}. The last question was: "${lastQuestion}". The candidate responded: "${answer}". Please ask the next interview question based on this information.`;
        }

        console.log("Generated prompt:", prompt);

        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const question = response.text().trim();
          interviewData.push({ question: question, answer: answer });
          ws.send(JSON.stringify({ question: question }));
        } catch (error) {
          console.error("Error generating interview question:", error);
          ws.send(
            JSON.stringify({ error: "Failed to generate interview question" })
          );
        }
      } else {
        ws.send(JSON.stringify({ message: "Interview complete" }));
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/yourdbname", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Start the server
const PORT = process.env.PORT || 3015;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = app;
