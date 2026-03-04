import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked'; // Make sure to run: npm install marked
import './style.css';
// Assuming you move the image to your assets or public folder
// If using Vite/Webpack, you can import it:
import chatIcon from './chatbot-icon.png';

const ChatWidget = ({ isOpen, onClose }) => {

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi There,\nHow can I help you today?",
      isHtml: false
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatBodyRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  // Initialize Session ID
  useEffect(() => {
    if (!localStorage.getItem('chatSessionId')) {
      const sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatSessionId', sessionId);
    }
  }, []);

  const handleSendMessage = async (textOverride) => {
    const text = textOverride || inputValue.trim();
    if (!text) return;

    // Add user message
    setMessages(prev => [
      ...prev,
      { id: Date.now(), type: 'user', text }
    ]);
    setInputValue("");
    setIsTyping(true);

    try {
      const sessionId = localStorage.getItem('chatSessionId');

      const response = await fetch(
        'https://n8n.srv1443461.hstgr.cloud/webhook/86e428b1-c897-44c9-8599-424213e04a79/chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            message: text,
            chatInput: text
          })
        }
      );

      const data = await response.json();
      console.log("n8n RAW RESPONSE 👉", data);

      let botText = "Sorry, I didn’t understand that.";

      // 🔥 HANDLE ALL n8n RESPONSE TYPES
      if (typeof data === "string") {
        botText = data;
      }
      else if (data.text) {
        botText = data.text;
      }
      else if (data.response) {
        botText = data.response;
      }
      else if (data.answer) {
        botText = data.answer;
      }
      else if (data.output) {
        botText = data.output;
      }
      else if (Array.isArray(data)) {
        const item = data[0];
        if (item?.json?.response) botText = item.json.response;
        else if (item?.json?.text) botText = item.json.text;
        else if (item?.json?.answer) botText = item.json.answer;
        else botText = JSON.stringify(item.json);
      }
      else if (data.data) {
        botText = typeof data.data === "string"
          ? data.data
          : JSON.stringify(data.data);
      }

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, type: 'bot', text: botText }
      ]);

    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: `Error: ${err.message || "Server is not responding right now."}`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleQuickAction = (text) => {
    handleSendMessage(text);
  };

  // Helper to render markdown safely
  const renderMessageContent = (text) => {
    // Configure marked to likely be secure or use a sanitizer library in production
    const rawMarkup = marked.parse(text);
    return { __html: rawMarkup };
  };

  /* 🔴 ADD THIS LINE HERE */
  if (!isOpen) return null;
  /* ⬇️ return starts AFTER this */
  return (
    <>
      {/* Main Chat Container */}
      <div className={`chat-container ${!isOpen ? 'minimized' : ''}`}>

        {/* Header */}
        <div className="chat-header">
          <div className="header-top">
            <div className="window-controls">
              <button className="icon-btn-small" onClick={onClose}>
                ↓
              </button>

            </div>
          </div>

          <div className="brand-wrapper">
            <div className="avatar-container">
              <div className="avatar-circle">
                <img src={chatIcon} alt="Sakthi" className="avatar-img" />
              </div>

              <div className="status-dot"></div>
            </div>
            <h2 className="brand-name">I'm Sakthi</h2>
            <p className="brand-subtitle">How can I help you today?</p>
            <button className="learn-more-btn">

            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="chat-body" id="chatBody" ref={chatBodyRef}>
          <div className="date-divider">
            Today, {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.type}`}>
              {msg.type === 'bot' && (
                <div className="message-avatar">
                  <div className="content-avatar">
                    <img src={chatIcon} alt="Bot" className="message-avatar-img" />
                  </div>

                </div>
              )}
              <div className="message-content">
                {msg.type === 'bot' ? (
                  <div
                    className="bubble"
                    dangerouslySetInnerHTML={renderMessageContent(msg.text)}
                  />
                ) : (
                  <div className="bubble">{msg.text}</div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper bot">
              <div className="message-avatar">
                <div className="content-avatar">
                  <img src={chatIcon} alt="Typing" className="message-avatar-img" />
                </div>

              </div>
              <div className="message-content">
                <div className="bubble">...</div>
              </div>
            </div>
          )}

          {/* Quick Actions (only show if chat is empty or always? Original showed always) */}
          <div className="quick-actions">
            <button className="action-chip" onClick={() => handleQuickAction("Courses")}>Courses</button>
            <button className="action-chip" onClick={() => handleQuickAction("Address")}>Address</button>
          </div>
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <div className="input-container">
            <input
              type="text"
              placeholder="Type and press [enter]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />


            <button className="send-btn" onClick={() => handleSendMessage()}>
              ➤
            </button>
          </div>
          <div className="powered-by">
            Lasak
          </div>
        </div>
      </div>


    </>
  );
};

export default ChatWidget;
