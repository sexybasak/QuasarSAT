import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { MessageCircle, Mail, Phone, ArrowRight, Shield, Award, Cpu, Layers } from 'lucide-react';
import { SpaceScene } from './SpaceScene';
import Pricing from './Pricing';
import QuasarAgent from './QuasarAgent';

export default function App() {
  const [view, setView] = useState('home');

  const Section = ({ children }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.1 }}
      className="max-w-6xl w-full px-6 flex flex-col items-center justify-center min-h-[80vh]"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="relative min-h-screen w-full font-sans text-white bg-black overflow-x-hidden">
      
      {/* 3D CANVAS LAYER */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Suspense fallback={null}>
            <SpaceScene />
          </Suspense>
        </Canvas>
      </div>

      {/* NAVIGATION */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-5xl">
        <nav className="bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-full h-20 flex items-center justify-between px-10">
          <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl shadow-blue-500/20">Q</div>
            <span className="font-black tracking-tighter text-2xl">QuasarPrep</span>
          </div>
          <div className="hidden md:flex gap-10 items-center font-black text-[11px] uppercase tracking-[0.2em]">
            <button onClick={() => setView('home')} className={view === 'home' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}>Strategy</button>
            <button onClick={() => setView('about')} className={view === 'about' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}>Our Mission</button>
            <button onClick={() => setView('pricing')} className={view === 'pricing' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}>Pricing</button>
            <button onClick={() => setView('home')} className="bg-white text-black px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl">Diagnostic</button>
          </div>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main className="relative z-10 pt-40 pb-20 flex justify-center items-center overflow-y-auto no-scrollbar h-screen snap-y snap-mandatory">
        <AnimatePresence mode="wait">
          
          {view === 'home' && (
            <Section key="home">
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="text-center">
                <h1 className="text-8xl md:text-[120px] font-black tracking-tighter leading-none mb-10">
                  Neural <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">SAT Logic.</span>
                </h1>
                <p className="text-2xl text-slate-400 font-bold max-w-2xl mx-auto italic mb-12 leading-relaxed">
                  Navigating the complex digital SAT® through 3D cognitive mapping and Socratic analysis.
                </p>
                <button onClick={() => setView('about')} className="bg-blue-600 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-white hover:text-black transition-all">Deconstruct The Method</button>
              </motion.div>
            </Section>
          )}

          {view === 'about' && (
            <Section key="about">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 md:p-20 rounded-[4rem] shadow-2xl max-w-5xl">
                <h2 className="text-5xl font-black tracking-tighter mb-8 italic text-blue-400 text-center">Master the SAT®. Navigate Your Future.</h2>
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                   {[
                     { icon: <Layers/>, t: "3D Visualizations", d: "Interact with real celestial logic models for abstract concepts." },
                     { icon: <Target/>, t: "Algorithmic Precision", d: "Mirroring the exact adaptive structure of the Digital SAT®." },
                     { icon: <Cpu/>, t: "Digital Era Tools", d: "Native Desmos mastery and smart elimination protocols." }
                   ].map((p, i) => (
                     <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/5">
                        <div className="text-blue-500 mb-6">{p.icon}</div>
                        <h4 className="font-black text-lg mb-2">{p.t}</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">{p.d}</p>
                     </div>
                   ))}
                </div>
                <div className="mt-12 pt-12 border-t border-white/10 text-center">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest leading-relaxed">
                    SAT® is a registered trademark of the College Board, which is not affiliated with this website.
                  </p>
                </div>
              </div>
            </Section>
          )}

          {view === 'pricing' && <Pricing key="pricing" />}
        </AnimatePresence>
      </main>

      {/* AGENT & WHATSAPP */}
      <QuasarAgent />
      <motion.a 
        href="https://wa.me/917061014213" target="_blank"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        className="fixed bottom-8 left-8 z-[200] bg-[#25D366] text-white p-5 rounded-full shadow-2xl"
      >
        <MessageCircle size={32} />
      </motion.a>
    </div>
  );
}
