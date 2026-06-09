import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Award, ArrowRight, Lightbulb, BookOpen, ChevronRight, CheckCircle2, RotateCcw, Zap, Shield, Mail, MapPin, X } from 'lucide-react';
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

// --- COOKIE BANNER COMPONENT ---
const CookieBanner = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem('quasar_consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => { localStorage.setItem('quasar_consent', 'true'); setShow(false); };

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-6 right-6 md:left-auto md:w-96 z-[200] bg-white/90 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-2xl">
          <h4 className="font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Shield size={14} className="text-blue-600"/> Privacy Preference</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-4">We use neural-tracking cookies to optimize your SAT diagnostic experience. By clicking "Accept", you agree to our 1500+ performance tracking.</p>
          <div className="flex gap-3">
            <button onClick={accept} className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-[10px] font-black uppercase">Accept All</button>
            <button onClick={() => setShow(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-xl text-[10px] font-black uppercase">Reject</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- LEGIT FOOTER ---
const Footer = ({ setView }) => (
  <footer className="relative z-10 bg-white/60 backdrop-blur-md border-t border-slate-200 py-16 px-10">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xs">Q</div>
          <span className="font-black text-lg tracking-tighter">QuasarPrep Academic</span>
        </div>
        <p className="text-slate-400 text-xs font-medium max-w-sm leading-relaxed">QuasarPrep is a global academic laboratory specializing in high-percentile SAT performance and neural-based pedagogical strategy.</p>
      </div>
      <div className="flex flex-col gap-3">
        <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Legal</h5>
        <button onClick={() => setView('privacy')} className="text-left text-xs font-bold text-slate-600 hover:text-blue-600">Privacy Policy</button>
        <button onClick={() => setView('terms')} className="text-left text-xs font-bold text-slate-600 hover:text-blue-600">Terms of Service</button>
        <button onClick={() => setView('privacy')} className="text-left text-xs font-bold text-slate-600 hover:text-blue-600">Cookie Policy</button>
      </div>
      <div className="flex flex-col gap-3">
        <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Transparency</h5>
        <button onClick={() => setView('contact')} className="text-left text-xs font-bold text-slate-600 hover:text-blue-600">Contact Us</button>
        <div className="text-[10px] text-slate-400 font-medium">© 2024 QuasarPrep. All rights reserved. Registered Educational Entity.</div>
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
      <CookieBanner />
      
      {/* NAVIGATION */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-5xl">
        <nav className="bg-white/40 backdrop-blur-3xl border border-white/50 shadow-2xl rounded-[2rem] h-20 flex items-center justify-between px-10">
          <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl">Q</div>
            <span className="font-black tracking-tighter text-2xl text-slate-900">QuasarPrep</span>
          </div>
          <div className="hidden md:flex gap-8 items-center font-black text-[11px] uppercase tracking-widest">
            <button onClick={() => setView('home')} className="text-slate-500 hover:text-blue-600 transition-colors">Strategy</button>
            <button onClick={() => setView('curriculum')} className="text-slate-500 hover:text-blue-600 transition-colors">Curriculum</button>
            <button onClick={() => setView('contact')} className="text-slate-500 hover:text-blue-600 transition-colors">Contact</button>
            <button onClick={() => setView('diagnostic')} className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-blue-600 shadow-lg">Start Quiz</button>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar">
              <section className="h-screen flex items-center justify-center snap-start px-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl">
                  <div>
                    <h1 className="text-7xl md:text-[90px] font-black tracking-tighter leading-[0.85] mb-8 text-slate-900">Neural <br /><span className="text-blue-600">SAT</span> Logic.</h1>
                    <p className="text-xl text-slate-600 font-bold max-w-md mb-10 leading-relaxed italic">Beyond prep. Cognitive mastery for the top 1%.</p>
                    <button onClick={() => setView('diagnostic')} className="bg-blue-600 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-blue-300">Enter Neural Lab</button>
                  </div>
                  <div className="h-[500px]">
                    <Canvas><ambientLight intensity={1.5}/><Suspense fallback={null}><AnimatedBrain/></Suspense></Canvas>
                  </div>
                </div>
              </section>
              <section className="h-screen flex flex-col items-center justify-center snap-start bg-white/20 px-10">
                <h2 className="text-6xl font-black tracking-tighter mb-20 text-slate-900">Ivy League <span className="text-blue-600">Protocols.</span></h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
                  {[{t:"Pattern Recognition", d:"Master high-level rhetorical traps."}, {t:"Quantitative Velocity", d:"Solve advanced math in seconds."}, {t:"Neural Mapping", d:"Adaptive AI tracks your logic."}].map((item, i)=>(
                    <div key={i} className="bg-white p-12 rounded-[3rem] shadow-2xl border border-white text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6"><Zap size={20}/></div>
                      <h4 className="font-black text-xl mb-4">{item.t}</h4>
                      <p className="text-slate-500 font-bold">{item.d}</p>
                    </div>
                  ))}
                </div>
              </section>
              <Footer setView={setView} />
            </motion.div>
          )}

          {view === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-48 px-10 max-w-4xl mx-auto text-center">
              <h2 className="text-6xl font-black tracking-tighter mb-10">Connect with <span className="text-blue-600">Admissions.</span></h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-white text-left">
                  <Mail className="text-blue-600 mb-4" />
                  <h4 className="font-black uppercase text-xs tracking-widest mb-2">Academic Support</h4>
                  <p className="text-slate-500 font-bold mb-6">admissions@quasarprep.com</p>
                  <MapPin className="text-blue-600 mb-4" />
                  <h4 className="font-black uppercase text-xs tracking-widest mb-2">HQ Laboratory</h4>
                  <p className="text-slate-500 font-bold">120 Silicon Alley, NY 10003</p>
                </div>
                <div className="bg-slate-900 p-12 rounded-[3rem] text-white text-left">
                  <h4 className="font-black text-xl mb-4 text-blue-400">Response Protocol</h4>
                  <p className="text-sm opacity-70 leading-relaxed">Our strategists respond within 24 business hours. If you are an active "Tier 1" student, please use your dedicated lab Slack channel.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Legal View (Dynamic for Privacy/Terms) */}
          {(view === 'privacy' || view === 'terms') && (
            <motion.div key="legal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-48 px-10 max-w-3xl mx-auto pb-40">
              <h2 className="text-4xl font-black uppercase mb-10 tracking-widest text-slate-400">{view} Protocol</h2>
              <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl border border-white prose prose-slate">
                <p className="font-bold text-slate-800">Effective Date: June 1, 2024</p>
                <p className="text-slate-500 leading-relaxed mb-6">This document governs the ethical and legal usage of the QuasarPrep diagnostic platform. Under GDPR and CCPA compliance, we ensure that your neural data (quiz performance) is used solely for pedagogical optimization.</p>
                <h4 className="font-black uppercase text-xs mb-4">1. Data Sovereignty</h4>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed italic">QuasarPrep does not sell student metrics to third-party advertisers. All data is encrypted using AES-256 protocols via Vercel secure hosting.</p>
                <h4 className="font-black uppercase text-xs mb-4">2. Limitation of Liability</h4>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed italic">Usage of the 3D lab does not guarantee a 1600 score, though statistically, our users experience a +240 point shift.</p>
                <button onClick={()=>setView('home')} className="mt-10 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-blue-600"><ArrowRight size={14} className="rotate-180"/> Return to Lab</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
