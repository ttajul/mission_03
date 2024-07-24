const WebSocket = require("ws");
const Interview = require("./models/interview"); // Add this line

const wssPort = process.env.WS_PORT || 8105;
const wss = new WebSocket.Server({ port: wssPort });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", async (message) => {
    console.log("Received message:", message);

    try {
      const data = JSON.parse(message);
      const { jobTitle, company, answer } = data;

      const generatedQuestion = `Based on your input for the ${jobTitle} at ${company}, here is a new question.`;
      const response = { question: generatedQuestion };

      // Save the interview data to the database
      const interview = new Interview({
        jobTitle,
        company,
        question: generatedQuestion,
        answer,
      });
      await interview.save();

      console.log("Sending response:", response); // Log the response before sending
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

module.exports = wss;
