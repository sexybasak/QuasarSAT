import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Brain, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are the Quasar Neural Strategist for QuasarPrep. Goal: Convert visitors to paid SAT plans ($50 or $150).`;

const QuasarAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Neural Link Established. How can I help you reach 1500+ today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // DEBUG: Check if the key is actually loading
  const API_KEY = import.meta.env.VITE_GEMINI_KEY;

  const handleChat = async () => {
    if (!input.trim() || loading) return;

    // 1. Check if key exists
    if (!API_KEY) {
      alert("CRITICAL ERROR: VITE_GEMINI_KEY is undefined. Check Vercel Environment Variables.");
      return;
    }

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userText }] }]);
    setInput('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        systemInstruction: SYSTEM_PROMPT 
      });

      const chat = model.startChat({
        history: messages,
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: text }] }]);
    } catch (error) {
      // 2. Log the REAL error to the console
      console.error("FULL AI ERROR LOG:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: `Error: ${error.message}` }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ zIndex: 9999, position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-slate-900 text-white p-5 rounded-full shadow-2xl z-[9999]"
      >
        {isOpen ? <X /> : <Bot color="#60a5fa" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-28 right-8 w-80 h-[500px] bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden border z-[9998]"
          >
            <div className="bg-slate-900 p-4 text-white font-bold flex gap-2 items-center">
                <Brain size={18} /> Neural Agent
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4 text-sm no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={`inline-block p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-blue-500 animate-pulse text-xs">Strategizing...</div>}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input 
                className="flex-grow bg-slate-50 p-2 rounded-lg outline-none text-sm"
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              />
              <button onClick={handleChat} className="bg-slate-900 text-white p-2 rounded-lg">Go</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuasarAgent;
