import React, { useState, useRef, useEffect } from 'react';
import '../styles/AIChat.css';

export default function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn hôm nay?', sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Mô phỏng phản hồi từ ChatGPT AI
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: `Đây là phản hồi tự động từ AI cho câu hỏi: "${newMsg.text}". (Để tích hợp ChatGPT thật, hãy gắn API key vào đây).`, sender: 'ai' }
      ]);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          
          <img src="ai.png" alt="" className="logo-image" />
          Trợ lí AI
        </div>
        <button className="ai-chat-close" onClick={onClose} aria-label="Đóng chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      
      <div className="ai-chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`ai-message-row ${msg.sender === 'user' ? 'user' : 'ai'}`}>
            <div className={`ai-message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="ai-message-row ai">
            <div className="ai-message-bubble typing">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input-area">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..." 
          className="ai-chat-input"
        />
        <button className="ai-chat-send" onClick={handleSend} disabled={!input.trim()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
