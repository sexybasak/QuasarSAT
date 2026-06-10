import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Brain, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = "You are the Quasar Neural Strategist. Goal: Guide students to 1500+ SAT scores and promote QuasarPrep plans ($50/$150). Contact: +917061014213. Email: quasarprep@quasarprep.online. Be elite, professional, and concise.";

const QuasarAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  // UI Messages (includes the welcome message)
  const [uiMessages, setUiMessages] = useState([
    { role: 'model', text: "Neural Link Established. I am your Quasar Strategist. How can I help you reach 1500+ today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GEMINI_KEY;

  const handleChat = async () => {
    if (!input.trim() || loading || !API_KEY) return;

    const userText = input;
    setUiMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT // Latest SDKs support this
      });

      // --- THE CRITICAL FIX ---
      // We filter the history to ensure it ONLY contains user/model pairs 
      // and ALWAYS starts with a 'user' message.
      const apiHistory = uiMessages
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      // If the first message in history is 'model', remove it (Gemini requirement)
      if (apiHistory.length > 0 && apiHistory[0].role === 'model') {
        apiHistory.shift();
      }

      const chat = model.startChat({
        history: apiHistory,
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      const botText = response.text();

      setUiMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setUiMessages(prev => [...prev, { role: 'model', text: "Neural logic recalibrating. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [uiMessages, loading]);

  return (
    <div style={{ zIndex: 9999, position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-white/20 flex items-center justify-center z-[9999]"
      >
        {isOpen ? <X size={24} /> : <Bot size={28} className="text-blue-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 right-8 w-[350px] h-[500px] bg-white/90 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden z-[9998]"
          >
            <div className="bg-slate-900 p-6 text-white flex items-center gap-3">
              <Brain size={20} className="text-blue-400" />
              <span className="font-black text-xs uppercase tracking-widest">Neural Strategist</span>
            </div>

            <div ref={chatRef} className="flex-grow p-6 overflow-y-auto space-y-4 no-scrollbar">
              {uiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold shadow-sm ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-[10px] font-black text-blue-600 animate-pulse uppercase">Syncing...</div>}
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                type="text" value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Type your query..."
                className="flex-grow bg-slate-50 border-none rounded-xl px-4 py-2 text-sm outline-none font-medium"
              />
              <button onClick={handleChat} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuasarAgent;
