import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatBot.css";

const ChatBot = ({ courseId, courseName = "General" }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMsg = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userMessage: inputValue,
          courseId,
          courseName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMsg = {
          role: "assistant",
          content: data.assistantResponse,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setError(data.message || "Error sending message");
        // Remove the user message if there was an error
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError("Failed to send message. Please try again.");
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/chat/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        setMessages([]);
        setError("");
      }
    } catch (err) {
      console.error("Clear chat error:", err);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Open AI Assistant"
        >
          <span className="chat-icon">💬</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <h3>AI Assistant</h3>
              <p className="course-name">{courseName}</p>
            </div>
            <div className="chatbot-actions">
              <button
                className="clear-btn"
                onClick={handleClearChat}
                title="Clear chat history"
              >
                🗑️
              </button>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <h4>Welcome to AI Assistant</h4>
                <p>Ask me anything about <strong>{courseName}</strong> or general topics</p>
                <ul>
                  <li>Explain course concepts</li>
                  <li>Answer general questions</li>
                  <li>Provide learning guidance</li>
                  <li>Help with practice problems</li>
                </ul>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className="message-content">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={isLoading || !inputValue.trim()}
            >
              📤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
