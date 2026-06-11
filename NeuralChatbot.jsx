import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Sparkles, Brain, 
  User, Loader2, Minimize2, Maximize2,
  Target, BookOpen, BarChart3, Lightbulb
} from 'lucide-react';

// --- CONFIGURATION ---
const AI_CONFIG = {
  name: "Neural Tutor",
  avatar: "Q",
  welcomeMessage: "Welcome to the Neural Lab. I'm your SAT reasoning agent. I can deconstruct problems, identify pattern gaps, and guide your cognitive map. What concept shall we explore?",
  systemPrompt: "You are Neural Tutor, an elite SAT preparation AI agent. You specialize in: 1) Pattern recognition in Digital SAT questions, 2) Socratic questioning to guide students to answers, 3) Real-time error analysis, 4) Adaptive difficulty calibration. Always think step-by-step and show your reasoning. Use LaTeX for math. Be concise but thorough.",
  maxTokens: 2048,
  temperature: 0.7,
  topP: 0.95,
  model: "meta-llama/llama-3.1-8b-instruct:free"
};

// --- SUGGESTION CHIPS ---
const SUGGESTION_CHIPS = [
  { icon: Target, label: "Quant Strategy", prompt: "Show me a high-yield algebra pattern for Digital SAT" },
  { icon: BookOpen, label: "Reading Traps", prompt: "What are the 3 most common inference traps in SAT Reading?" },
  { icon: BarChart3, label: "Score Analysis", prompt: "Analyze my diagnostic weak points" },
  { icon: Lightbulb, label: "Socratic Drill", prompt: "Give me a Socratic walkthrough of a hard geometry problem" },
];

// --- OPENROUTER API STREAMING ---
const streamOpenRouterResponse = async (messages, onChunk, onComplete, onError) => {
  try {
    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!API_KEY) throw new Error('VITE_OPENROUTER_API_KEY not configured');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'https://quasarprep.online',
        'X-Title': 'QuasarPrep SAT Tutor'
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: AI_CONFIG.systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ],
        stream: true,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
        top_p: AI_CONFIG.topP
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onComplete(fullText);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              onChunk(content);
            }
          } catch (e) {
            // skip malformed lines
          }
        }
      }
    }
    onComplete(fullText);
  } catch (error) {
    onError(error.message);
  }
};

// --- MOCK STREAM (Fallback when no API key) ---
const streamMockResponse = async (onChunk, onComplete) => {
  const mockResponses = [
    "Analyzing your query through the neural network...",
    "This is a classic **Pattern Type 7** — quadratic systems with hidden symmetry.",
    "Let's apply the Socratic method: What do you notice about the coefficients $a$ and $b$ in the system?",
    "The key insight is recognizing that $x^2 + y^2 = (x+y)^2 - 2xy$.",
    "This allows us to collapse the system into a single variable substitution.",
    "Try setting $u = x + y$ and $v = xy$. The equations become: $u^2 - 2v = 25$ and $u + v = 11$.",
    "From the second: $v = 11 - u$. Substitute: $u^2 - 2(11-u) = 25$ → $u^2 + 2u - 47 = 0$.",
    "Solving: $u = -1 \\pm \\sqrt{48}$. Since $x,y$ are positive, $u = -1 + 4\\sqrt{3}$.",
    "Therefore, the answer is **A**.",
    "Would you like me to generate a similar problem for practice, or shall we analyze your error pattern from the diagnostic?"
  ];
  
  let fullText = "";
  for (const segment of mockResponses) {
    for (let i = 0; i < segment.length; i++) {
      await new Promise(r => setTimeout(r, 25));
      fullText += segment[i];
      onChunk(segment[i]);
    }
    fullText += "\n\n";
    onChunk("\n\n");
    await new Promise(r => setTimeout(r, 300));
  }
  onComplete(fullText);
};

// --- UNIFIED STREAM HANDLER ---
const streamAIResponse = async (messages, onChunk, onComplete, onError) => {
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (API_KEY && API_KEY.length > 10) {
    await streamOpenRouterResponse(messages, onChunk, onComplete, onError);
  } else {
    console.warn('No VITE_OPENROUTER_API_KEY found, using mock stream');
    await streamMockResponse(onChunk, onComplete);
  }
};

// --- MESSAGE COMPONENT ---
const ChatMessage = ({ message, isStreaming, isLatest }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}
    >
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
          isUser ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
        }`}
      >
        {isUser ? <User size={18} /> : <Brain size={18} />}
      </motion.div>

      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-6 py-4 rounded-[2rem] shadow-lg backdrop-blur-xl ${
          isUser 
            ? 'bg-slate-900 text-white rounded-tr-sm' 
            : 'bg-white/60 border border-white/50 text-slate-800 rounded-tl-sm'
        }`}>
          <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
            {message.content}
            {isStreaming && isLatest && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-1"
              />
            )}
          </div>
        </div>
        <div className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {message.timestamp}
        </div>
      </div>
    </motion.div>
  );
};

// --- TYPING INDICATOR ---
const TypingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 mb-6 ml-14"
  >
    <div className="bg-white/60 backdrop-blur-xl border border-white/50 px-6 py-4 rounded-[2rem] rounded-tl-sm shadow-lg flex items-center gap-2">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-blue-600 rounded-full" />
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-blue-400 rounded-full" />
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-blue-300 rounded-full" />
      <span className="text-xs font-black text-blue-600 uppercase tracking-widest ml-2">Neural Processing</span>
    </div>
  </motion.div>
);

// --- MAIN CHATBOT COMPONENT ---
export default function NeuralChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: AI_CONFIG.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const key = import.meta.env.VITE_OPENROUTER_API_KEY;
    setHasApiKey(key && key.length > 10);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (text = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsStreaming(true);

    const aiMessageId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    }]);

    let accumulatedText = '';
    await streamAIResponse(
      [...messages, userMessage],
      (chunk) => {
        accumulatedText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: accumulatedText } : msg
        ));
        scrollToBottom();
      },
      (finalText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: finalText, isStreaming: false } : msg
        ));
        setIsLoading(false);
        setIsStreaming(false);
      },
      (error) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: `Neural link disrupted: ${error}. Please retry or check your API configuration.`, isStreaming: false } : msg
        ));
        setIsLoading(false);
        setIsStreaming(false);
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (prompt) => {
    handleSend(prompt);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-[300] w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles size={28} className="relative z-10" />
            {!hasApiKey && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white" title="Mock mode - add API key for live AI" />
            )}
            {hasApiKey && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" title="Live AI connected" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              width: isExpanded ? '90vw' : '420px',
              height: isExpanded ? '85vh' : '600px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-8 right-8 z-[300] bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col"
            style={{ maxWidth: isExpanded ? '1000px' : '420px' }}
          >
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg"
                >
                  {AI_CONFIG.avatar}
                </motion.div>
                <div>
                  <h3 className="font-black text-lg tracking-tight">{AI_CONFIG.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${hasApiKey ? 'bg-green-400' : 'bg-amber-400'}`} />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {hasApiKey ? 'Neural Link Active' : 'Mock Mode — Add API Key'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </motion.button>
                <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {!hasApiKey && messages.length <= 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6"
                >
                  <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-1">Configuration Needed</p>
                  <p className="text-sm text-amber-700 font-medium">
                    Add <code className="bg-amber-500/20 px-1 rounded">VITE_OPENROUTER_API_KEY</code> to your <code className="bg-amber-500/20 px-1 rounded">.env</code> file for live AI responses.
                  </p>
                </motion.div>
              )}

              {messages.length <= 1 && !isLoading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 gap-3 mb-8">
                  {SUGGESTION_CHIPS.map((chip, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSuggestionClick(chip.prompt)}
                      className="bg-white/60 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-lg flex flex-col items-center gap-2 hover:bg-white/80 hover:border-blue-300 transition-all group"
                    >
                      <chip.icon size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{chip.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {messages.map((msg, index) => (
                <ChatMessage key={msg.id} message={msg} isStreaming={msg.isStreaming} isLatest={index === messages.length - 1} />
              ))}
              {isLoading && !isStreaming && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white/60 backdrop-blur-xl border-t border-white/50 shrink-0">
              <div className="flex items-end gap-3 bg-white/80 rounded-[2rem] p-2 pl-6 shadow-lg border border-white/50">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about SAT patterns, strategies, or your diagnostic..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-sm font-medium text-slate-800 placeholder:text-slate-400 py-3 max-h-32"
                  rows={1}
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    inputValue.trim() && !isLoading ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-500' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
                </motion.button>
              </div>
              <div className="text-center mt-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {hasApiKey ? 'Powered by OpenRouter • Real-time Stream' : 'Mock Mode — Add VITE_OPENROUTER_API_KEY for Live AI'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
