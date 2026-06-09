import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Award, ArrowRight, Menu, X } from 'lucide-react';
import Home from './pages/Home';
import Curriculum from './pages/Curriculum';
import Diagnostic from './pages/Diagnostic';

// --- MAGNETIC BUTTON COMPONENT ---
const MagneticButton = ({ children, className }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- MOVING WATER BACKGROUND ---
const WaterBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#f0f7ff]">
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
        x: [0, 100, 0],
        y: [0, 50, 0]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] rounded-full bg-gradient-to-r from-blue-200/40 to-cyan-100/40 blur-[120px]"
    />
    <motion.div 
      animate={{ 
        scale: [1.2, 1, 1.2],
        rotate: [90, 0, 90],
        x: [0, -100, 0],
        y: [0, -50, 0]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-20%] right-[-10%] w-[100%] h-[100%] rounded-full bg-gradient-to-r from-indigo-100/30 to-blue-200/30 blur-[120px]"
    />
    {/* Animated Wave Overlay */}
    <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
  </div>
);

const Nav = () => (
  <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-5xl">
    <div className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-full px-8 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center text-white font-black">Q</div>
        <span className="font-black tracking-tighter text-xl text-slate-800">QuasarPrep</span>
      </Link>
      <div className="hidden md:flex gap-8">
        <MagneticButton><Link to="/" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">Strategy</Link></MagneticButton>
        <MagneticButton><Link to="/curriculum" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">Curriculum</Link></MagneticButton>
        <MagneticButton><Link to="/diagnostic" className="bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Start Quiz</Link></MagneticButton>
      </div>
    </div>
  </nav>
);

export default function App() {
  return (
    <Router>
      <WaterBackground />
      <Nav />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
