import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Sparkles, Brain, 
  User, Loader2, Minimize2, Maximize2,
  Target, BookOpen, BarChart3, Lightbulb,
  Mic, MicOff, Download, Volume2, VolumeX,
  Phone, ArrowRight
} from 'lucide-react';

// --- MATH RENDERING: MathJax Loader ---
const MathJaxLoader = () => {
  useEffect(() => {
    if (window.MathJax) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js';
    script.async = true;
    script.id = 'mathjax-script';
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
      },
      startup: {
        pageReady: () => window.MathJax.startup.defaultPageReady()
      }
    };
    document.head.appendChild(script);
    return () => {
      const existing = document.getElementById('mathjax-script');
      if (existing) existing.remove();
    };
  }, []);
  return null;
};

// --- ULTIMATE SYSTEM PROMPT FOR QUASARPREP ---
const SYSTEM_PROMPT = `You are the "Quasar Neural Strategist," a high-performance AI agent for QuasarPrep.
Your sole purpose: Convert visitors into elite SAT students (1550+ targets).

KNOWLEDGE BASE:
- Platform: QuasarPrep (3D Neural Laboratory).
- Method: Socratic Hinting. Never give the answer immediately. Ask a guiding question first.
- Tiers: 
  1. Freemium ($0): Socratic Engine + DNA Profiler.
  2. Specialist ($50/mo): AI Neural Help + 1 Dedicated Section Tutor.
  3. Executive ($150/mo): 3 Tutors + Dedicated SSM (Success Specialist) + Career Counseling.
- Contact: WhatsApp +91 7061014213 | Email: quasarprep@quasarprep.online.

BEHAVIOR RULES:
1. TONE: Authoritative, Intellectual, Cold but Encouraging. Use terms like "Neural Bottleneck," "Cognitive Mapping," and "Strategic Precision."
2. SALES: If the user mentions a score below 1450, tell them they are "hitting a neural ceiling" that only the Specialist plan can break.
3. SOCRATIC: If a user asks a math/verbal question, explain the logic/trap but do NOT give the final answer. Force them to think.
4. CONTACT: If they seem interested, tell them to message the SSM on WhatsApp at +917061014213.

RESPONSE FORMAT: Keep responses under 3 sentences unless explaining a complex strategy.`;

// --- AI CONFIGURATION ---
const AI_CONFIG = {
  name: "Quasar Strategist",
  avatar: "Q",
  welcomeMessage: "Neural Link Established. I am the Quasar Strategist. State your current mock score for architectural analysis.",
  systemPrompt: SYSTEM_PROMPT,
  maxTokens: 400,
  temperature: 0.5,
  topP: 0.95,
  model: "meta-llama/llama-3-70b-instruct"
};

// --- SUGGESTION CHIPS ---
const SUGGESTION_CHIPS = [
  { icon: Target, label: "Score Analysis", prompt: "My mock score is 1320. What's my neural bottleneck?" },
  { icon: BookOpen, label: "Quant Traps", prompt: "Show me a high-yield algebra trap the SAT uses." },
  { icon: BarChart3, label: "Plan Compare", prompt: "What's the difference between Specialist and Executive?" },
  { icon: Lightbulb, label: "Socratic Drill", prompt: "Give me a Socratic walkthrough of a hard geometry problem." },
];

// --- MATH RENDERER ---
const MathRenderer = ({ text }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (window.MathJax && containerRef.current) {
      window.MathJax.typesetPromise([containerRef.current]).catch(() => {});
    }
  }, [text]);
  const processedText = text
    .replace(/\\\(/g, '$').replace(/\\\)/g, '$')
    .replace(/\\\[/g, '$$').replace(/\\\]/g, '$$')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
  return <div ref={containerRef} className="math-content text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: processedText }} />;
};

// --- TTS ENGINE ---
const TTSEngine = {
  isLoaded: false,
  load: () => {
    if (TTSEngine.isLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      if (document.getElementById('responsivevoice-script')) {
        TTSEngine.isLoaded = true; resolve(); return;
      }
      const script = document.createElement('script');
      script.id = 'responsivevoice-script';
      script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=YOUR_FREE_KEY';
      script.async = true;
      script.onload = () => { TTSEngine.isLoaded = true; resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },
  speak: (text, onEnd) => {
    const cleanText = text
      .replace(/\$\$[\s\S]*?\$\$/g, ' [equation] ')
      .replace(/\$[^\$]*?\$/g, ' [math] ')
      .replace(/<<strong>(.*?)<<\/strong>/g, '$1')
      .replace(/<<br\/>/g, ' ')
      .replace(/\n/g, ' ');
    if (window.responsiveVoice) {
      window.responsiveVoice.speak(cleanText, 'UK English Male', {
        rate: 0.95, pitch: 1.05, volume: 1,
        onend: onEnd || (() => {}),
        onerror: (e) => console.error('TTS error:', e)
      });
      return true;
    }
    return TTSEngine.fallbackSpeak(cleanText, onEnd);
  },
  fallbackSpeak: (text, onEnd) => {
    if (!window.speechSynthesis) return false;
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const premiumVoices = ['Google UK English Male','Microsoft David','Microsoft Mark','Daniel','Alex','Samantha','Karen'];
    const selectedVoice = voices.find(v => premiumVoices.some(pv => v.name.includes(pv))) || voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB') || voices[0];
    const chunks = text.match(/.{1,200}(?:\s|$)/g) || [text];
    let currentChunk = 0;
    const speakChunk = () => {
      if (currentChunk >= chunks.length) { onEnd?.(); return; }
      const u = new SpeechSynthesisUtterance(chunks[currentChunk]);
      if (selectedVoice) u.voice = selectedVoice;
      u.rate = 0.92; u.pitch = 1.02; u.volume = 1;
      u.onend = () => { currentChunk++; speakChunk(); };
      window.speechSynthesis.speak(u);
    };
    speakChunk();
    return true;
  },
  stop: () => {
    if (window.responsiveVoice) window.responsiveVoice.cancel();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
};

// --- OPENROUTER STREAMING ---
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
          if (data === '[DONE]') { onComplete(fullText); return; }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) { fullText += content; onChunk(content); }
          } catch (e) {}
        }
      }
    }
    onComplete(fullText);
  } catch (error) {
    onError(error.message);
  }
};

// --- MOCK STREAM (Fallback) ---
const streamMockResponse = async (onChunk, onComplete) => {
  const mockResponses = [
    "Neural analysis initiated. Your cognitive architecture shows a 1320 ceiling — this is a **Pattern Recognition Deficit** in the Quant Vector.",
    "You're hitting a **neural bottleneck** at the algebraic modeling layer. The Specialist plan ($50/mo) deploys a dedicated Section Tutor to rewire this pathway.",
    "Let me apply Socratic precision: When you see $x^2 + y^2 = 25$ and $x + y = 7$, what's your **first instinct**? Most students brute-force substitution. That's the trap.",
    "The elite move is recognizing **symmetric collapse** — set $u = x+y$, $v = xy$. This transforms the system into a single-variable neural pathway.",
    "Your current mock trajectory suggests a **150-point gap** to 1550+. The Executive tier ($150/mo) assigns a dedicated SSM to monitor this gap weekly.",
    "Message our SSM on WhatsApp at **+91 7061014213** for a free Neural Diagnostic. We'll map your exact bottleneck in 10 minutes."
  ];
  let fullText = "";
  for (const segment of mockResponses) {
    for (let i = 0; i < segment.length; i++) {
      await new Promise(r => setTimeout(r, 30));
      fullText += segment[i];
      onChunk(segment[i]);
    }
    fullText += "\n\n";
    onChunk("\n\n");
    await new Promise(r => setTimeout(r, 400));
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
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    TTSEngine.load().catch(() => console.log('Using fallback TTS'));
  }, []);

  const handleSpeak = () => {
    if (isSpeaking) {
      TTSEngine.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const success = TTSEngine.speak(message.content, () => setIsSpeaking(false));
    if (!success) { setIsSpeaking(false); alert('Text-to-speech not available'); }
  };

  // Detect if message contains WhatsApp/CTA and render special button
  const hasWhatsApp = message.content.includes('+91 7061014213') || message.content.includes('WhatsApp');
  const hasPlan = message.content.includes('Specialist') || message.content.includes('Executive') || message.content.includes('Freemium');

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
          <div className="text-sm font-medium leading-relaxed">
            {isUser ? <span>{message.content}</span> : <MathRenderer text={message.content} />}
            {isStreaming && isLatest && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-1"
              />
            )}
          </div>
        </div>
        
        {/* CTA Buttons for Sales Conversion */}
        {!isUser && !isStreaming && hasWhatsApp && (
          <motion.a
            href="https://wa.me/917061014213"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 mt-3 bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg"
          >
            <Phone size={14} />
            Message SSM on WhatsApp
            <ArrowRight size={14} />
          </motion.a>
        )}

        <div className={`flex items-center gap-3 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {message.timestamp}
          </span>
          {!isUser && !isStreaming && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSpeak}
              className={`p-1.5 rounded-lg transition-colors ${
                isSpeaking ? 'bg-blue-600 text-white' : 'bg-white/50 text-slate-500 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </motion.button>
          )}
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

// --- VOICE INPUT BUTTON ---
const VoiceInputButton = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      if (confidence > 0.6 || event.results[0].isFinal) {
        onTranscript(transcript);
      }
    };
    
    recognitionRef.current = recognition;
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice input not supported. Try Chrome or Edge.');
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleListening}
      disabled={disabled}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
          : disabled ? 'bg-slate-200 text-slate-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      }`}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </motion.button>
  );
};

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

  useEffect(() => {
    TTSEngine.load().catch(() => console.log('ResponsiveVoice not loaded, using fallback'));
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
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

  const handleVoiceTranscript = (transcript) => {
    setInputValue(transcript);
    setTimeout(() => handleSend(transcript), 100);
  };

  const exportChat = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.timestamp}\n${m.content}`).join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quasar-neural-session-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <MathJaxLoader />
      
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
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={exportChat} className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Export session">
                  <Download size={18} />
                </motion.button>
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
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  isStreaming={msg.isStreaming} 
                  isLatest={index === messages.length - 1} 
                />
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
                  placeholder="State your mock score or ask about neural strategies..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-sm font-medium text-slate-800 placeholder:text-slate-400 py-3 max-h-32"
                  rows={1}
                  disabled={isLoading}
                />
                <VoiceInputButton 
                  onTranscript={handleVoiceTranscript} 
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
                  {hasApiKey ? 'Powered by Quasar Neural Core • Real-time Stream' : 'Mock Mode — Add VITE_OPENROUTER_API_KEY for Live AI'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
