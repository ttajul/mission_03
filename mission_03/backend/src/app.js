const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");
const aiRoutes = require("./routes/aiRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const WebSocket = require("ws");

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
const PORT = process.env.PORT || 3016;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

// WebSocket server setup
const wssPort = process.env.WS_PORT || 8098;
const wss = new WebSocket.Server({ port: wssPort });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  let interviewContext = []; // Store the context of the interview

  ws.on("message", async (message) => {
    console.log("Received message:", message);

    try {
      const data = JSON.parse(message);
      const { jobTitle, company, answer } = data;

      // Add the user's answer to the context
      interviewContext.push(`Answer: ${answer}`);

      // Generate the new question
      const prompt = `You are interviewing for a ${jobTitle} position at ${company}. Here are the previous answers: ${interviewContext.join(
        " "
      )}. Please generate the next interview question.`;
      const result = await model.generateContent(prompt);
      const newQuestion = result.content.trim();

      // Add the new question to the context
      interviewContext.push(`Question: ${newQuestion}`);

      const response = { question: newQuestion };
      console.log("Sending response:", response);
      ws.send(JSON.stringify(response));
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });

  ws.on("close", (code, reason) => {
    console.log(
      `WebSocket connection closed. Reason: ${reason}, Code: ${code}`
    );
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

module.exports = app;
