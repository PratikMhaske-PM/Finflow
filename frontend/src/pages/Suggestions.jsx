import React, { useState, useRef, useEffect } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { Lightbulb, Send, User } from 'lucide-react';
import './FinancePages.css';
import './Suggestions.css';

const Suggestions = () => {
  const { getSuggestions, isLoading, error } = useFinanceStore();
  
  // Track standard chat history for UI rendering
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am your AI Financial Advisor. How can I help you manage your money, budget, or investments today?' }
  ]);
  
  // Track raw Gemini API history
  const [apiHistory, setApiHistory] = useState([]);
  const [input, setInput] = useState('');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    // Send to backend with current api history
    const response = await getSuggestions(userMessage, apiHistory);
    
    if (response.success) {
      // Add model response to UI
      setMessages(prev => [...prev, { role: 'model', text: response.data }]);
      
      // Update raw API history for context retention
      setApiHistory(prev => [
        ...prev,
        { role: 'user', parts: [{ text: userMessage }] },
        { role: 'model', parts: [{ text: response.data }] }
      ]);
    }
  };

  return (
    <div className="finance-page suggestions-page">
      <header className="page-header">
        <h1>AI Financial Assistant</h1>
        <p className="subtitle">Powered by Google Gemini. Chat with your personal advisor.</p>
      </header>

      <div className="finance-content chat-layout">
        <div className="chat-container">
          <div className="chat-history">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message-wrapper ${msg.role === 'user' ? 'user-message-wrapper' : 'ai-message-wrapper'}`}>
                {msg.role === 'model' && (
                  <div className="chat-avatar ai-avatar">
                    <Lightbulb size={20} />
                  </div>
                )}
                
                <div className={`chat-bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                  {msg.role === 'user' ? (
                    <p>{msg.text}</p>
                  ) : (
                    <div className="html-content" dangerouslySetInnerHTML={{ __html: msg.text }} />
                  )}
                </div>
                
                {msg.role === 'user' && (
                  <div className="chat-avatar user-avatar">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message-wrapper ai-message-wrapper">
                <div className="chat-avatar ai-avatar pulse-icon">
                  <Lightbulb size={20} />
                </div>
                <div className="chat-bubble ai-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input-area">
            {error && <div className="error-text" style={{width: '100%', padding: '0 1rem', marginBottom: '0.5rem', color: 'var(--danger-color)'}}>{error}</div>}
            <div className="input-wrapper">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about budgets, investments, saving for a house..."
                disabled={isLoading}
              />
              <button type="submit" disabled={!input.trim() || isLoading} className="send-btn">
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
