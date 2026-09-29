import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const suggestions = [
  "Add an expense for lunch.",
  "Show my expenses this month.",
  "Change my last expense.",
  "Delete my Uber expense."
];

const CATEGORIES = [
  'Education', 'Entertainment', 'Fees', 'Groceries', 'Healthcare',
  'Housing', 'Insurance', 'Personal Care', 'Restaurants', 'Shopping',
  'Subscription', 'Transportation', 'Travel', 'Utilities'
];

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hi! I am your AI Expense Assistant. Tell me what you spent on recently.',
    isConfirmation: false
  }
];

export function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      
      let aiResponse = { id: Date.now() + 1, role: 'assistant', content: data.message, isConfirmation: false };
      
      if (data.status === 'PENDING_CONFIRMATION' && data.expense) {
         aiResponse.isConfirmation = true;
         aiResponse.confirmationData = {
           description: data.expense.description,
           amount: data.expense.amount,
           category: data.expense.predicted_category,
           date: data.expense.date,
           confidence: data.expense.confidence
         };
      }
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Oops! Something went wrong connecting to the server.' }]);
    }
  };

  const handleConfirmExpense = async (msgId, expenseData) => {
    try {
      const response = await fetch('http://localhost:8000/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: expenseData.description,
          amount: parseFloat(expenseData.amount),
          category: expenseData.category,
          transaction_date: expenseData.date
        })
      });
      
      if (response.ok) {
        setMessages(prev => prev.map(msg => msg.id === msgId ? { ...msg, isConfirmation: false } : msg));
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Expense saved successfully!' }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Failed to save expense.' }]);
      }
    } catch (error) {
      console.error("Failed to save", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Error saving expense.' }]);
    }
  };

  const handleCancelExpense = (msgId) => {
    setMessages(prev => prev.map(msg => msg.id === msgId ? { ...msg, isConfirmation: false } : msg));
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'No problem, I cancelled that expense.' }]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">AI Expense Assistant</h2>
        <p className="text-slate-500 mt-1">Manage your expenses using natural language.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-sm border-slate-200">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-2xl mx-auto">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="text-left px-4 py-3 text-sm text-slate-600 bg-slate-50 hover:bg-primary-50 hover:text-primary-700 rounded-lg border border-slate-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'}`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              
              <div className={`space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm'}`}>
                  {msg.content}
                </div>

                {msg.isConfirmation && msg.confirmationData && (
                  <div className="bg-white border border-primary-100 shadow-sm rounded-xl overflow-hidden w-64 md:w-80">
                    <div className="bg-primary-50 px-4 py-2 border-b border-primary-100 flex justify-between items-center">
                      <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider">I understood:</p>
                      {msg.confirmationData.confidence && (
                        <span className="text-[10px] font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                           {(msg.confirmationData.confidence * 100).toFixed(0)}% Match
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Description</span>
                        <span className="font-medium text-slate-800">{msg.confirmationData.description}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Amount</span>
                        <span className="font-medium text-slate-800">Rs. {msg.confirmationData.amount}</span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-slate-500">Category</span>
                        <select 
                           value={msg.confirmationData.category}
                           onChange={(e) => {
                              const newCat = e.target.value;
                              setMessages(prev => prev.map(m => m.id === msg.id ? {
                                 ...m, confirmationData: { ...m.confirmationData, category: newCat }
                              } : m));
                           }}
                           className="font-medium text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Date</span>
                        <span className="font-medium text-slate-800">{msg.confirmationData.date}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 flex gap-2 border-t border-slate-100">
                      <Button variant="secondary" size="sm" className="flex-1 gap-1" onClick={() => handleCancelExpense(msg.id)}>
                        <X className="w-3.5 h-3.5" /> Cancel
                      </Button>
                      <Button size="sm" className="flex-1 gap-1" onClick={() => handleConfirmExpense(msg.id, msg.confirmationData)}>
                        <Check className="w-3.5 h-3.5" /> Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex items-center gap-2 max-w-4xl mx-auto"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. I spent 25 at Starbucks yesterday"
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 shrink-0 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
