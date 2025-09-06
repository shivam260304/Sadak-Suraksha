import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const avatarColors = {
  user: 'bg-blue-600',
  bot: 'bg-purple-600'
};

const avatarIcons = {
  user: '👤',
  bot: '🤖'
};

const ChatPopup = ({ isOpen = true, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: "Welcome to Sadak Suraksha! 🚦 How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Send message and get bot response
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(msgs => [...msgs, userMsg]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/message', {
        message: userInput,
        sessionId: 'sadaksuraksha-ui'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // Fixed: 30 second timeout instead of 3,000,000ms
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        content: response.data.response || "Sorry, I couldn't generate a response.",
        timestamp: new Date()
      };
      
      setMessages(msgs => [...msgs, botMsg]);
      
    } catch (error) {
      console.error('Chatbot API Error:', error);
      
      let errorMessage = "Sorry, there was an error connecting to the chatbot.";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = `Server error: ${error.response.data?.error || error.response.statusText}`; // Fixed: proper template literal
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        errorMessage = "Request timed out. Please try again.";
      }
      
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        content: errorMessage,
        timestamp: new Date()
      };
      
      setMessages(msgs => [...msgs, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div 
      className={`fixed left-5 bottom-5 w-[min(400px,90vw)] h-[min(530px,90vh)] bg-[#23233a] rounded-2xl shadow-2xl z-[1000] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#232347] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-slate-200">Assistant</span>
          <span className="text-xs px-2 py-1 rounded bg-purple-700 text-white">using proxy</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-light leading-none bg-transparent border-none cursor-pointer rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close chat"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-[#23233a]">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`} // Fixed: proper template literal
          >
            <div className="flex items-start gap-2 max-w-[85%]">
              {msg.sender === 'bot' && 
                <div className={`w-9 h-9 ${avatarColors.bot} rounded-full flex items-center justify-center text-[18px]`}> {/* Fixed: proper template literal */}
                  {avatarIcons.bot}
                </div>
              }
              <div className={
                `rounded-2xl px-4 py-3 text-[15px] font-normal leading-snug ${msg.sender === 'user' 
                  ? 'bg-blue-700 text-white rounded-br-md'
                  : 'bg-[#2e2e47] text-purple-100 rounded-bl-md'}`
                }
                style={{wordBreak: 'break-word'}}
              >
                <span>{msg.content}</span>
                <div className="text-xs opacity-60 mt-1">
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              {msg.sender === 'user' && 
                <div className={`w-9 h-9 ${avatarColors.user} rounded-full flex items-center justify-center text-[18px]`}> {/* Fixed: proper template literal */}
                  {avatarIcons.user}
                </div>
              }
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start w-full">
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className={`w-9 h-9 ${avatarColors.bot} rounded-full flex items-center justify-center text-[18px]`}> {/* Fixed: proper template literal */}
                {avatarIcons.bot}
              </div>
              <div className="bg-[#2e2e47] text-purple-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-3 bg-[#242443] border-t border-gray-800 flex items-end gap-2">
        <textarea
          className="flex-1 resize-none rounded-lg bg-[#313156] text-slate-100 p-3 border border-gray-700 focus:outline-none focus:border-blue-400 placeholder:text-slate-400 text-sm"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..." // Fixed: correct placeholder text
          disabled={loading}
        />
        <button
          className={`bg-purple-700 hover:bg-purple-800 p-3 rounded-lg text-white disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center transition-colors duration-200`} // Fixed: proper template literal
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
