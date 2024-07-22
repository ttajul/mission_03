import React, { useState, useEffect } from "react";
import "../styles/chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const connect = () => {
      const websocket = new WebSocket("ws://localhost:8098");
      setWs(websocket);

      websocket.onopen = () => {
        console.log("WebSocket connection established");
      };

      websocket.onmessage = (event) => {
        console.log("Received data:", event.data); // Log raw data
        try {
          const data = JSON.parse(event.data);
          if (data.question) {
            const newMessage = {
              id: messages.length + 1,
              text: data.question,
              sender: "bot",
            };
            console.log("Adding new message to state: ", newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        } catch (error) {
          console.error("Error parsing message data:", error);
        }
      };

      websocket.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(connect, 1000); // Attempt to reconnect after 1 second
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connect();
  }, [messages.length]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !jobTitle.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };
    console.log("Sending new message to state: ", newMessage);
    setMessages([...messages, newMessage]);
    setInput("");

    if (ws && ws.readyState === WebSocket.OPEN) {
      const company = "Example Tech Inc."; // Replace with actual value if needed
      const message = { jobTitle, company, answer: input };
      console.log("Sending message:", message);
      ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. ReadyState: " + ws.readyState);
    }
  };

  const toggleChatbot = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {!isExpanded && (
        <div id="chatbot-modal" onClick={toggleChatbot}>
          Chat with us!
        </div>
      )}

      {isExpanded && (
        <div id="chatbot-container" className="chatbot-container expanded">
          <div className="chat-header">
            <span>Chat with us!</span>
            <div className="control-buttons">
              <button className="control-button" onClick={toggleChatbot}>
                _
              </button>
            </div>
          </div>
          <div className="chat-title">
            <p>Job Title:</p>
            <input
              type="text"
              placeholder="Enter the job title..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="submit-message">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(e);
                }
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
