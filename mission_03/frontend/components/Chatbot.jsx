import { useEffect, useState } from "react";
import "../styles/chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; //prevent sending empty messages

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    setInput("");

    // Here you could also integrate with a backend service to get a response

    try {
      const response = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleChatbot = () => {
    setIsExpanded(!isExpanded);
    const chatbot = document.getElementById("chatbot-container");
    if (isExpanded) {
      chatbot.classList.remove("expanded");
    } else {
      chatbot.classList.add("expanded");
    }
  };

  return (
    <>
      {!isExpanded && (
        <div id="chatbot-modal" onClick={toggleChatbot}>
          Click to Chat
        </div>
      )}

      {isExpanded && (
        <div className="chatbot-container expanded">
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
            <input type="text" placeholder="Enter your job name..." />
          </div>
          {/* Render messages and input field for new messages here */}
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
