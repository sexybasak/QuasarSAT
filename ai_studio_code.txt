import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ChevronRight, Target, BookOpen, BarChart3, Star, CheckCircle2, Menu, X, ArrowRight } from 'lucide-react';

// --- ANIMATION COMPONENT: THE INTERACTIVE QUASAR ---
const QuasarAnimation = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Glow */}
      <motion.div 
        animate={{
          x: (mousePos.x - window.innerWidth / 2) * 0.05,
          y: (mousePos.y - window.innerHeight / 2) * 0.05,
        }}
        className="absolute w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60"
      />
      
      {/* Interactive Orbitals */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10 + i * 5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '50%',
            position: 'absolute'
          }}
        />
      ))}

      {/* The Quasar Core */}
      <motion.div
        whileHover={{ scale: 1.2 }}
        className="relative z-10 w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
      >
        <div className="text-white text-center">
          <div className="text-2xl font-bold tracking-tighter">1600</div>
          <div className="text-[10px] uppercase tracking-widest">Potential</div>
        </div>
        
        {/* Particle Stream */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, (Math.random() - 0.5) * 400],
              y: [0, (Math.random() - 0.5) * 400],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
          />
        ))}
      </motion.div>

      <div className="absolute bottom-10 text-slate-400 text-sm font-medium">
        [ Move your mouse to influence the Quasar Field ]
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function QuasarPrep() {
  const [currentPage, setCurrentPage] = useState('home');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const navLinks = [
    { id: 'home', label: 'Strategy' },
    { id: 'curriculum', label: '1500+ Curriculum' },
    { id: 'enroll', label: 'Enrollment' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 origin-left" style={{ scaleX }} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">Q</div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">Quasar<span className="text-blue-600">Prep</span></span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map(link => (
              <button 
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`text-sm font-semibold transition-colors ${currentPage === link.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {link.label}
              </button>
            ))}
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10">
              Student Portal
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Hero Section */}
              <section className="py-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                  >
                    <Star size={14} fill="currentColor" /> The Ivy League Standard
                  </motion.div>
                  <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                    Master the SAT. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                      Exceed 1500.
                    </span>
                  </h1>
                  <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                    QuasarPrep utilizes adaptive cognitive mapping to identify your scoring ceilings. We don't just teach the test; we re-engineer your approach to logic.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setCurrentPage('enroll')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                      Start Your Assessment <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
                
                {/* INTERACTIVE ANIMATION CALL */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                  <QuasarPrepAnimation />
                </div>
              </section>

              {/* Stats Section */}
              <section className="bg-white py-20 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
                  {[
                    { label: 'Average Score Increase', val: '+240 pts' },
                    { label: '99th Percentile Tutors', val: 'Top 1%' },
                    { label: 'Ivy League Admissions', val: '84%' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-4xl font-black text-slate-900 mb-2">{stat.val}</div>
                      <div className="text-slate-500 font-medium uppercase tracking-widest text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'curriculum' && (
            <motion.div 
              key="curriculum"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-20 max-w-7xl mx-auto px-6"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Precision Engineering for Every Section</h2>
                <p className="text-slate-500">Built for the Digital SAT environment.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: 'Quantitative Mastery', icon: <Target className="text-blue-600" />, features: ['Advanced Trigonometry', 'Function Analysis', 'Time-Pressure Hacks'] },
                  { title: 'Evidence-Based Writing', icon: <BookOpen className="text-indigo-600" />, features: ['Rhetorical Synthesis', 'Standard English Conventions', 'Transitions Mastery'] },
                  { title: 'Critical Analytics', icon: <BarChart3 className="text-cyan-600" />, features: ['Data Interpretation', 'Cross-Textual Analysis', 'Main Idea Extraction'] },
                ].map((item, idx) => (
                  <motion.div 
                    whileHover={{ y: -10 }}
                    key={idx} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50"
                  >
                    <div className="mb-6 p-4 bg-slate-50 w-fit rounded-xl">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <ul className="space-y-3">
                      {item.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                          <CheckCircle2 size={16} className="text-green-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'enroll' && (
            <motion.div 
              key="enroll"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="py-20 max-w-3xl mx-auto px-6"
            >
              <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
                <h2 className="text-3xl font-bold mb-2">Begin Your Orbit</h2>
                <p className="text-slate-500 mb-8">Schedule your diagnostic and meet your 1550+ mentor.</p>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400">Full Name</label>
                      <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400">Target Score</label>
                      <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20">
                        <option>1500 - 1530</option>
                        <option>1540 - 1570</option>
                        <option>1580 - 1600</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Email Address</label>
                    <input type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20" placeholder="john@university.edu" />
                  </div>
                  <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200">
                    Reserve My Diagnostic
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm">© 2024 QuasarPrep Academic Group. High-performance SAT coaching.</div>
          <div className="flex gap-8 text-slate-600 font-medium text-sm">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for the hero animation to isolate rendering
function QuasarPrepAnimation() {
  return <QuasarAnimation />;
}