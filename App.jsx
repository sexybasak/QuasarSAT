import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Star, ArrowRight, Target, BookOpen, BarChart3, CheckCircle2, Menu, X, ShieldCheck, Zap } from 'lucide-react';
import Quiz from './Quiz.jsx'; // Importing the Quiz component

// --- INTERACTIVE HERO ANIMATION ---
const QuasarAnimation = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-inner">
      <motion.div 
        animate={{ x: (mousePos.x - 500) * 0.05, y: (mousePos.y - 500) * 0.05 }}
        className="absolute w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"
      />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
          className="absolute border border-blue-100 rounded-full"
          style={{ width: `${150 + i * 80}px`, height: `${150 + i * 80}px` }}
        />
      ))}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="relative z-10 w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer"
      >
        <div className="text-center">
          <div className="text-xl font-bold">1600</div>
          <div className="text-[8px] uppercase tracking-[0.2em]">Orbit</div>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN APPLICATION ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // home, curriculum, quiz
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[60] origin-left" style={{ scaleX }} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">Q</div>
            <span className="text-2xl font-bold tracking-tight">Quasar<span className="text-blue-600">Prep</span></span>
          </div>
          <div className="hidden md:flex gap-8 items-center font-semibold text-sm">
            <button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'text-blue-600' : 'text-slate-500'}>Strategy</button>
            <button onClick={() => setCurrentPage('curriculum')} className={currentPage === 'curriculum' ? 'text-blue-600' : 'text-slate-500'}>1500+ Curriculum</button>
            <button onClick={() => setCurrentPage('quiz')} className="bg-slate-900 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all">Take Diagnostic</button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <section className="py-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    <Star size={14} fill="currentColor" /> Ivy League Standards
                  </div>
                  <h1 className="text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                    The Smart Path to <span className="text-blue-600">1500+</span>
                  </h1>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-md">
                    We don't teach test-taking. We teach cognitive dominance. Master the logic of the Digital SAT with QuasarPrep.
                  </p>
                  <button onClick={() => setCurrentPage('quiz')} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 hover:shadow-2xl hover:shadow-blue-200 transition-all">
                    Start Elite Quiz <ArrowRight size={20} />
                  </button>
                </div>
                <QuasarAnimation />
              </section>
            </motion.div>
          )}

          {currentPage === 'curriculum' && (
            <motion.div key="curr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Precision-Engineered Learning</h2>
                <p className="text-slate-500">Every module is calibrated for the upper percentiles.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Advanced Math", icon: <Zap className="text-blue-600" />, desc: "Non-linear systems and complex data analysis." },
                  { title: "Rhetorical Logic", icon: <ShieldCheck className="text-indigo-600" />, desc: "Mastering transitions and logical inference." },
                  { title: "Adaptive Strategy", icon: <Target className="text-cyan-600" />, desc: "Time management for high-pressure scoring." }
                ].map((card, i) => (
                  <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow">
                    <div className="mb-6">{card.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-slate-600 text-sm">{card.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <Quiz />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
