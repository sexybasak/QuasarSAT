import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Brain, Target, Award, ArrowRight, MessageCircle, Mail, Phone, RotateCcw } from 'lucide-react';
import { SpaceScene } from './SpaceScene';
import Pricing from './Pricing';
import QuasarAgent from './QuasarAgent';

export default function App() {
  const [view, setView] = useState('home');

  const GlassContainer = ({ children }) => (
    <motion.div 
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      className="bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-hidden bg-[#020617]">
      
      {/* 3D BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <SpaceScene />
          </Suspense>
        </Canvas>
      </div>

      {/* GLOBAL NAVIGATION */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-5xl">
        <nav className="bg-black/20 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full h-16 flex items-center justify-between px-8">
          <div onClick={() => setView('home')} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">Q</div>
            <span className="font-black tracking-tighter text-xl">QuasarPrep</span>
          </div>
          <div className="flex gap-6 items-center font-black text-[10px] uppercase tracking-widest text-slate-400">
            <button onClick={() => setView('home')} className={view === 'home' ? 'text-white' : ''}>Home</button>
            <button onClick={() => setView('about')} className={view === 'about' ? 'text-white' : ''}>Mission</button>
            <button onClick={() => setView('pricing')} className={view === 'pricing' ? 'text-white' : ''}>Plans</button>
            <button onClick={() => setView('home')} className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-500 transition-all">Diagnostic</button>
          </div>
        </nav>
      </header>

      {/* UI OVERLAY LAYER */}
      <main className="relative z-10 pt-40 flex flex-col items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <Section key="home">
              <div className="max-w-4xl text-center">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-8"
                >
                  Neural <span className="text-blue-500">SAT</span> Lab.
                </motion.h1>
                <p className="text-xl text-slate-400 font-bold mb-12 italic">Precision engineering for the 1550+ score threshold.</p>
                <button onClick={() => setView('about')} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 mx-auto">
                  Deconstruct Method <ArrowRight size={20}/>
                </button>
              </div>
            </Section>
          )}

          {view === 'about' && (
            <Section key="about">
              <GlassContainer>
                <h2 className="text-5xl font-black mb-8 tracking-tight">Navigate Your Future.</h2>
                <p className="text-slate-300 text-lg font-medium leading-relaxed mb-8">
                  QuasarPrep is a dynamic, adaptive, and precise ecosystem. We’ve stripped away dry textbooks for high-performance interactive models.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h4 className="font-black text-blue-400 mb-2 uppercase text-xs">Integrity</h4>
                    <p className="text-sm text-slate-400">Unique diagnostic modules engineered by subject experts.</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h4 className="font-black text-blue-400 mb-2 uppercase text-xs">Precision</h4>
                    <p className="text-sm text-slate-400">Mirroring the adaptive structure of the Digital SAT®.</p>
                  </div>
                </div>
              </GlassContainer>
            </Section>
          )}

          {view === 'pricing' && <Pricing key="pricing" />}
        </AnimatePresence>
      </main>

      {/* WHATSAPP & AGENT */}
      <QuasarAgent />
      <motion.a 
        href="https://wa.me/917061014213" target="_blank"
        className="fixed bottom-8 left-8 z-[200] bg-[#25D366] p-4 rounded-full shadow-2xl"
      >
        <MessageCircle size={32} />
      </motion.a>
    </div>
  );
}

function Section({ children }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5 }}>
      {children}
    </motion.div>
  );
}
