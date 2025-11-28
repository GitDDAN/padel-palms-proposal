import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to Padel & Palms! I'm your AI concierge. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API (excluding the very first greeting if wanted, or keeping it)
    const historyForApi = messages.map(m => ({ role: m.role, text: m.text }));

    const responseText = await sendMessageToGemini(input, historyForApi);

    const botMessage: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-4 border-pp-teal overflow-hidden w-full max-w-md mx-auto h-[500px] flex flex-col relative transform rotate-1 hover:rotate-0 transition-transform duration-300">
      {/* Header */}
      <div className="bg-pp-teal p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-white rounded-full">
            <Bot className="text-pp-teal w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">AI Reception</h3>
            <span className="text-xs opacity-90 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online 24/7
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-pp-green text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-pp-teal" />
                <span className="text-xs text-gray-500">Typing...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions (if empty or strictly guided) */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => handleQuickAction("Can I order a towel for my next game?")}
          className="whitespace-nowrap px-3 py-1 bg-pp-pink/10 text-pp-pink text-xs rounded-full border border-pp-pink/30 hover:bg-pp-pink hover:text-white transition-colors"
        >
          🥎 Order Towel
        </button>
        <button 
          onClick={() => handleQuickAction("Reserve a court for 5 PM")}
          className="whitespace-nowrap px-3 py-1 bg-pp-teal/10 text-pp-teal text-xs rounded-full border border-pp-teal/30 hover:bg-pp-teal hover:text-white transition-colors"
        >
          📅 Book Court
        </button>
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pp-teal"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="p-2 bg-pp-green text-white rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};