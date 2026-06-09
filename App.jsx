import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Award, ArrowRight, Lightbulb, BookOpen, ChevronRight, CheckCircle2, RotateCcw, Zap, Shield, Mail, MapPin, Info, Layers, Cpu } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { QUIZ_DATA } from './questions.js';

// --- 3D BRAIN ---
function AnimatedBrain() {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.4;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 15]} /> 
        <MeshDistortMaterial color="#2563eb" distort={0.6} speed={5} roughness={0} metalness={1} />
      </mesh>
    </Float>
  );
}

// --- LIQUID BACKGROUND ---
const WaterBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#f0f9ff]">
    <motion.div animate={{ x: [-50, 50, -50], scale: [1, 1.2, 1] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-300/40 blur-[120px] rounded-full" />
    <motion.div animate={{ x: [50, -50, 50], scale: [1.2, 1, 1.2] }} transition={{ duration: 18, repeat: Infinity }} className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-cyan-200/40 blur-[120px] rounded-full" />
  </div>
);

// --- LEGIT FOOTER (Includes Trademark Disclaimer) ---
const Footer = ({ setView }) => (
  <footer className="relative z-10 bg-white/60 backdrop-blur-md border-t border-slate-200 py-16 px-10">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xs">Q</div>
            <span className="font-black text-lg tracking-tighter">QuasarPrep Academic</span>
          </div>
          <p className="text-slate-400 text-xs font-medium max-w-sm leading-relaxed">The world's premier digital SAT diagnostic platform. Engineered for elite scholars aiming for the 1500-1600 score threshold.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Company</h5>
          <button onClick={() => setView('about')} className="text-left text-xs font-bold text-slate-600 hover:text-blue-600">About Our Tech</button>
          <button onClick={() => setView('contact')} className="text-left text-xs font-bold text-slate-600 hover:text-blue-600">Support Lab</button>
        </div>
        <div className="flex flex-col gap-3">
          <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Legal</h5>
          <button onClick={() => setView('privacy')} className="text-left text-xs font-bold text-slate-600 hover:text-blue-600">Privacy & Data</button>
          <button onClick={() => setView('terms')} className="text-left text-xs font-bold text-slate-600 hover:text-blue-600">Terms of Service</button>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-8">
        <p className="text-[10px] text-slate-400 leading-relaxed italic text-center max-w-4xl mx-auto">
          SAT® is a registered trademark of the College Board, which is not affiliated with, and does not endorse, this website. QuasarPrep operates as an independent educational research laboratory.
        </p>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [view, setView] = useState('home');
  const [finalScore, setFinalScore] = useState(null);

  return (
    <div className="relative min-h-screen w-full">
      <WaterBackground />
      
      {/* NAVIGATION */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-5xl">
        <nav className="bg-white/40 backdrop-blur-3xl border border-white/50 shadow-2xl rounded-[2rem] h-20 flex items-center justify-between px-10">
          <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl">Q</div>
            <span className="font-black tracking-tighter text-2xl text-slate-900">QuasarPrep</span>
          </div>
          <div className="hidden md:flex gap-8 items-center font-black text-[11px] uppercase tracking-widest">
            <button onClick={() => setView('home')} className="text-slate-500 hover:text-blue-600 transition-colors">Strategy</button>
            <button onClick={() => setView('about')} className="text-slate-500 hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => setView('curriculum')} className="text-slate-500 hover:text-blue-600 transition-colors">Curriculum</button>
            <button onClick={() => setView('diagnostic')} className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-blue-600 shadow-lg transition-all">Start Quiz</button>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          
          {/* --- ABOUT PAGE VIEW --- */}
          {view === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar">
              
              {/* Section 1: Intro Hook */}
              <section className="h-screen flex items-center justify-center snap-start px-10">
                <div className="max-w-4xl text-center">
                  <motion.h2 initial={{ y: 20 }} animate={{ y: 0 }} className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-slate-900">
                    Master the <span className="text-blue-600">SAT®.</span> <br /> Navigate Your Future.
                  </motion.h2>
                  <p className="text-xl md:text-2xl text-slate-600 font-bold leading-relaxed max-w-3xl mx-auto">
                    At QuasarPrep we believe that preparing for the SAT® shouldn’t feel like staring at static paper. The digital SAT® is dynamic, adaptive, and precise—and your prep platform should be too.
                  </p>
                </div>
              </section>

              {/* Section 2: Mission */}
              <section className="h-screen flex items-center justify-center snap-start px-10 bg-white/20">
                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl">
                  <div className="order-2 lg:order-1 h-[400px]">
                     <Canvas><ambientLight intensity={1.5}/><Suspense fallback={null}><AnimatedBrain/></Suspense></Canvas>
                  </div>
                  <div className="order-1 lg:order-2 space-y-6">
                    <h3 className="text-4xl font-black tracking-tight text-blue-600 uppercase">Our Mission</h3>
                    <p className="text-2xl font-black text-slate-900 leading-tight italic">Clear Navigation Through Complex Testing</p>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                      Every student’s learning journey is fluid. Our mission is to guide you through the complexities of the digital SAT® with absolute clarity. We don't just teach you how to find the answer; we teach you how to think, adapt, and build deep analytical skills.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: The Pillars (Grid Cards) */}
              <section className="h-screen flex flex-col items-center justify-center snap-start px-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">The Quasar Pillars</h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl">
                  {[
                    { icon: <Layers size={24}/>, title: "3D Visualizations", desc: "We bring abstract math to life. Visualize geometric transformations and coordinate relationships instead of memorizing formulas." },
                    { icon: <Target size={24}/>, title: "Algorithmic Precision", desc: "Our practice modules mirror the exact rigor of the digital SAT®, giving you data-driven feedback on where to focus." },
                    { icon: <Cpu size={24}/>, title: "Built for Digital Era", desc: "From mastering the Desmos graphing calculator to smart elimination, we weaponize you with the exact technical skills required." }
                  ].map((pillar, i) => (
                    <motion.div whileHover={{ y: -10 }} key={i} className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl transition-all hover:bg-white">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200">{pillar.icon}</div>
                      <h4 className="font-black text-xl mb-4 text-slate-900">{pillar.title}</h4>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed">{pillar.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Section 4: Integrity & Footer */}
              <section className="h-screen flex flex-col items-center justify-center snap-start px-10">
                <div className="max-w-4xl text-center mb-20">
                  <h3 className="text-4xl font-black tracking-tight mb-8">Academic <span className="text-blue-600">Integrity & Excellence.</span></h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-bold">
                    We are deeply committed to providing an honest, high-impact learning environment. All our diagnostic modules and practice questions are uniquely engineered by subject matter experts to reflect the latest testing standards without violating copyright. We stand for authentic skill-building.
                  </p>
                </div>
                <Footer setView={setView} />
              </section>
            </motion.div>
          )}

          {/* ... [KEEP ALL OTHER VIEWS FROM PREVIOUS App.jsx (Home, Curriculum, Diagnostic, Legal, Contact)] ... */}
          
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar">
              <section className="h-screen flex items-center justify-center snap-start px-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl">
                  <div>
                    <h1 className="text-7xl md:text-[90px] font-black tracking-tighter leading-[0.85] mb-8 text-slate-900">Neural <br /><span className="text-blue-600">SAT</span> Logic.</h1>
                    <p className="text-xl text-slate-600 font-bold max-w-md mb-10 leading-relaxed italic">The World's Elite 1550+ Cognitive Lab.</p>
                    <button onClick={() => setView('diagnostic')} className="bg-blue-600 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl">Enter Neural Lab</button>
                  </div>
                  <div className="h-[500px]">
                    <Canvas><ambientLight intensity={1.5}/><Suspense fallback={null}><AnimatedBrain/></Suspense></Canvas>
                  </div>
                </div>
              </section>
              <Footer setView={setView} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
