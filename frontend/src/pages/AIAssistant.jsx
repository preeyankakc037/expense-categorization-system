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

// Mock initial state
const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'How can I help with your expenses?',
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

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response based on the prompt
    setTimeout(() => {
      let aiResponse = { id: Date.now() + 1, role: 'assistant', content: '', isConfirmation: false };

      if (text.toLowerCase().includes('add') && text.toLowerCase().includes('lunch')) {
        aiResponse.content = 'I can help with that. Please confirm the details below:';
        aiResponse.isConfirmation = true;
        aiResponse.confirmationData = {
          description: 'Lunch',
          amount: 'Rs. 500',
          category: 'Restaurants',
          date: 'Today'
        };
      } else {
        aiResponse.content = "I understand you want to manage your expenses. I'll be fully connected to the backend soon to process this request!";
      }

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">AI Expense Assistant</h2>
        <p className="text-slate-500 mt-1">Manage your expenses using natural language.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-sm border-slate-200">
        {/* Chat Area */}
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
                    <div className="bg-primary-50 px-4 py-2 border-b border-primary-100">
                      <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider">I understood:</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Description</span>
                        <span className="font-medium text-slate-800">{msg.confirmationData.description}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Amount</span>
                        <span className="font-medium text-slate-800">{msg.confirmationData.amount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Category</span>
                        <span className="font-medium text-slate-800">{msg.confirmationData.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Date</span>
                        <span className="font-medium text-slate-800">{msg.confirmationData.date}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 flex gap-2 border-t border-slate-100">
                      <Button variant="secondary" size="sm" className="flex-1 gap-1">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </Button>
                      <Button size="sm" className="flex-1 gap-1">
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

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex items-center gap-2 max-w-4xl mx-auto"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to add an expense, show charts, etc..."
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
