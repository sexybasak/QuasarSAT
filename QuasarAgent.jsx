import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Brain, Bot, Sparkles, MessageSquare } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- THE AGENT'S KNOWLEDGE BASE (System Prompt) ---
const SYSTEM_PROMPT = `
You are the "Quasar Neural Strategist," an elite AI agent for QuasarPrep. 
Your goal: Guide students to a 1500+ SAT score and convert visitors to paid plans.

QUASARPREP DATA:
- Pricing: Freemium ($0 - Socratic Engine), Specialist ($50 - 1 Tutor + AI), Executive ($150 - 3 Tutors + SSM).
- Contact: +91 7061014213 | Email: quasarprep@quasarprep.online
- Philosophy: We use 3D cognitive mapping and Socratic hints. We don't just give answers; we identify "Neural Traps."

AGENT RULES:
1. Be highly analytical, professional, and encouraging.
2. If a student mentions a score below 1400, emphasize that our "Socratic Clues" are the key to breaking the ceiling.
3. Always try to steer the conversation toward the "Diagnostic Lab" or the "Specialist Plan."
4. If asked about contact details, provide the WhatsApp number and Email.
5. Keep responses concise but architecturally brilliant.
`;

const QuasarAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Neural Link Established. I am your Quasar Strategist. Ready to architect your 1550+ roadmap. What is your current score?" }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // --- INITIALIZE GEMINI WITH ENV VARIABLE ---
  const API_KEY = import.meta.env.VITE_GEMINI_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Define the model with System Instructions
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT 
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleChat = async () => {
    if (!input.trim() || loading) return;
    if (!API_KEY) {
        console.error("Gemini API Key is missing. Check your .env file or Vercel Environment Variables.");
        return;
    }

    const userText = input;
    const newMessages = [...messages, { role: 'user', parts: [{ text: userText }] }];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Start chat with history
      const chat = model.startChat({
        history: messages,
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: text }] }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Neural connection interrupted. Please ensure your API key is correctly configured in the environment variables." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[999] bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl border border-white/20 flex items-center justify-center group"
      >
        {isOpen ? <X size={24} /> : <Bot size={28} className="text-blue-400 group-hover:text-blue-300" />}
        {!isOpen && (
            <span className="absolute -top-12 right-0 bg-white text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl shadow-xl border border-slate-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                AI Strategist Online
            </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            className="fixed bottom-28 right-8 z-[999] w-[90vw] md:w-[400px] h-[600px] bg-white/80 backdrop-blur-3xl border border-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
          >
            {/* Dark Header */}
            <div className="bg-slate-900 p-8 text-white flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 relative z-10">
                <Brain size={24} />
              </div>
              <div className="relative z-10">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-1">Quasar Neural AI</h4>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">1550+ Strategist Active</p>
                </div>
              </div>
            </div>

            {/* Chat History Area */}
            <div ref={chatRef} className="flex-grow p-6 overflow-y-auto no-scrollbar space-y-6 bg-slate-50/30">
              {messages.map((msg, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-semibold leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-200' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                    <div className="bg-white p-5 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-2">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-blue-600 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-blue-400 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-blue-200 rounded-full" />
                    </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-white/50 border-t border-slate-50">
              {['Pricing Plans', 'Diagnostic Quiz', 'Tutor Support'].map(text => (
                <button 
                  key={text}
                  onClick={() => { setInput(text); }}
                  className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 hover:border-blue-600 hover:text-blue-600 transition-all uppercase tracking-widest"
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Message Input Area */}
            <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Type your strategic query..."
                className="flex-grow bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleChat}
                disabled={loading}
                className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 disabled:opacity-30 transition-colors shadow-lg"
              >
                <Send size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuasarAgent;
