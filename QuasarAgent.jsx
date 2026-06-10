import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Brain } from 'lucide-react';

const QuasarAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'model', text: "Neural Link Established. Ready to architect your 1550+ roadmap." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // PASTE YOUR GOOGLE API KEY DIRECTLY HERE
  const KEY = "AQ.Ab8RN6Ll2ejXguOhdylS3gzDfoN9w0yUgY7sVdxH4a8sB0Va8g"; 

  const handleChat = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `System: You are an elite SAT Strategist for Quasarprep. User says: ${userText}` }] }]
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', text: data.candidates[0].content.parts[0].text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection lag detected." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-8 right-8 z-[200] bg-slate-900 text-white p-5 rounded-full shadow-2xl border border-white/10">
        {isOpen ? <X /> : <Bot className="text-blue-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-28 right-8 w-80 h-[500px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-[190]">
            <div className="bg-white/5 p-5 border-b border-white/10 flex items-center gap-2 font-black text-xs uppercase tracking-widest"><Brain size={16} className="text-blue-400"/> Neural Strategist</div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4 no-scrollbar text-sm">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={`inline-block p-3 rounded-2xl ${m.role === 'user' ? 'bg-blue-600' : 'bg-white/10 border border-white/10'}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} className="flex-grow bg-transparent outline-none text-xs" placeholder="Ask roadmap..." />
              <button onClick={handleChat} className="bg-blue-600 p-2 rounded-lg"><Send size={14}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuasarAgent;
