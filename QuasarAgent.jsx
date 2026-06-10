import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Brain, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = "You are the Quasar Neural Strategist. Your goal is to guide students to a 1500+ SAT score and suggest the $50 or $150 QuasarPrep plans. Contact: +917061014213.";

const QuasarAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Neural Link Established. Ready to architect your 1550+ roadmap. What is your current score?" }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // Access the key
  const API_KEY = import.meta.env.VITE_GEMINI_KEY;

  const handleChat = async () => {
    if (!input.trim() || loading || !API_KEY) return;

    const userText = input;
    // Format for Gemini SDK: role must be 'user' or 'model', parts must be an array
    const userMessage = { role: 'user', parts: [{ text: userText }] };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      
      // FIX: Using gemini-1.5-flash but with a config object
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
      });

      // We pass the history but we must ensure we don't include the 'systemInstruction' inside the history array
      const chat = model.startChat({
        history: messages,
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      // We prepend the system prompt to the user's message to ensure the "Agent" behavior 
      // even if the SDK doesn't support the top-level systemInstruction yet.
      const result = await chat.sendMessage(`[SYSTEM INSTRUCTION: ${SYSTEM_PROMPT}] User Message: ${userText}`);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: text }] }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      // Fallback: If 1.5 Flash fails, try the older but stable gemini-pro
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Neural logic recalibrating. Please try again in a moment." }] }]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

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
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold shadow-sm ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-100'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-[10px] font-black text-blue-600 animate-pulse uppercase">Logic processing...</div>}
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                type="text" value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask your roadmap..."
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
