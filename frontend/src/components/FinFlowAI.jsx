import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, TrendingUp } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';
import './FinFlowAI.css';

const FinFlowAI = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am FinFlow AI. Ask me about your spending, balances, or budgets!' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { getTotals, expenses, budgets, addIncome, addExpense } = useFinanceStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim().toLowerCase();
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Simulated Smart Rule Engine
    setTimeout(async () => {
      let response = "I'm still learning! Try asking about your 'balance', 'expenses', or 'budget'.";
      
      const { balance, totalExpense } = getTotals();

      // Check if user is trying to add data
      if (userMessage.startsWith('add ') || userMessage.includes(' add ')) {
        const typeMatch = userMessage.match(/(income|expense)/i);
        const amountMatch = userMessage.match(/(\d+)/);
        
        if (typeMatch && amountMatch) {
          const type = typeMatch[1].toLowerCase();
          const amount = parseInt(amountMatch[1], 10);
          
          let title = userMessage
            .replace(/\b(add|an|a|of|the|for|on|to)\b/g, '')
            .replace(type, '')
            .replace(amount.toString(), '')
            .replace(/\s+/g, ' ')
            .trim();
            
          if (!title) title = type === 'income' ? 'Misc Income' : 'Misc Expense';
          title = title.charAt(0).toUpperCase() + title.slice(1);

          if (type === 'income') {
             await addIncome({ title, amount, category: 'Other', date: new Date(), description: 'Added via FinFlow AI' });
             response = `✅ Successfully added ₹${amount.toLocaleString('en-IN')} as Income for "${title}".`;
          } else {
             await addExpense({ title, amount, category: 'Other', date: new Date(), description: 'Added via FinFlow AI' });
             response = `✅ Successfully added a ₹${amount.toLocaleString('en-IN')} Expense for "${title}".`;
          }
          
          setMessages(prev => [...prev, { role: 'assistant', content: response }]);
          return;
        } else {
          response = "To add something, try saying: 'Add expense 500 for groceries' or 'Add income 2000 for salary'.";
          setMessages(prev => [...prev, { role: 'assistant', content: response }]);
          return;
        }
      }

      if (userMessage.includes('balance') || userMessage.includes('net worth')) {
        response = `Your current total balance is ₹${balance.toLocaleString('en-IN')}. Looking good!`;
      } else if (userMessage.includes('spend') || userMessage.includes('expense')) {
        response = `You have spent a total of ₹${totalExpense.toLocaleString('en-IN')} across all your accounts.`;
      } else if (userMessage.includes('food')) {
        const foodSpent = expenses.filter(e => e.category === 'Food').reduce((a,b) => a+b.amount, 0);
        response = `You have spent ₹${foodSpent.toLocaleString('en-IN')} on Food & Dining so far.`;
      } else if (userMessage.includes('budget')) {
        response = budgets.length > 0 
          ? `You have ${budgets.length} active budgets tracking your goals.`
          : `You don't have any active budgets right now. I recommend setting one up in the Budgets tab!`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="ai-header-info">
          <div className="ai-avatar-glow">
            <Bot size={24} />
          </div>
          <div>
            <h3>FinFlow AI</h3>
            <p>Smart Financial Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="ai-close-btn">
          <X size={20} />
        </button>
      </div>
      
      <div className="ai-chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-message-wrapper ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="ai-message-avatar">
                <Sparkles size={14} />
              </div>
            )}
            <div className={`ai-message ${msg.role}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-suggestions">
        <button onClick={() => setInput("What is my balance?")}><TrendingUp size={14}/> Balance</button>
        <button onClick={() => setInput("How much did I spend on food?")}>Food Spend</button>
      </div>

      <form onSubmit={handleSend} className="ai-chat-input">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..." 
        />
        <button type="submit" disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default FinFlowAI;
