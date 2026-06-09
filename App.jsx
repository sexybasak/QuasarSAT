import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Award, ArrowRight, Lightbulb, BookOpen, ChevronRight, CheckCircle2, RotateCcw, Zap } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

// Ensure questions.js is in the same folder
import { QUIZ_DATA } from './questions.js';

// --- 3D BRAIN COMPONENT ---
function AnimatedBrain() {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = t * 0.2;
    mesh.current.rotation.y = t * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 15]} /> 
        <MeshDistortMaterial
          color="#2563eb"
          attach="material"
          distort={0.6}
          speed={5}
          roughness={0}
          metalness={1}
        />
      </mesh>
    </Float>
  );
}

// --- LIQUID WATER BACKGROUND ---
const WaterBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#dbeafe]">
    <motion.div 
      animate={{ x: [-100, 100, -100], y: [-50, 50, -50], scale: [1, 1.3, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-400/50 blur-[120px] rounded-full"
    />
    <motion.div 
      animate={{ x: [100, -100, 100], y: [50, -50, 50], scale: [1.3, 1, 1.3] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-cyan-400/40 blur-[120px] rounded-full"
    />
  </div>
);

// --- NAVIGATION ---
const Nav = ({ setView }) => (
  <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-5xl">
    <div className="bg-white/60 backdrop-blur-3xl border border-white/50 shadow-2xl rounded-[2rem] h-20 flex items-center justify-between px-10">
      <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">Q</div>
        <span className="font-black tracking-tighter text-2xl text-slate-900">QuasarPrep</span>
      </div>
      <div className="flex gap-8 items-center font-black text-[11px] uppercase tracking-widest">
        <button onClick={() => setView('home')} className="text-slate-500 hover:text-blue-600 transition-colors">Strategy</button>
        <button onClick={() => setView('curriculum')} className="text-slate-500 hover:text-blue-600 transition-colors">Curriculum</button>
        <button onClick={() => setView('diagnostic')} className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-all shadow-lg">Start Diagnostic</button>
      </div>
    </div>
  </nav>
);

// --- APP COMPONENT ---
export default function App() {
  const [view, setView] = useState('home');
  const [score, setScore] = useState(null);

  return (
    <div className="relative min-h-screen w-full">
      <WaterBackground />
      <Nav setView={setView} />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar"
            >
              {/* PAGE 1: HERO */}
              <section className="h-screen w-full flex items-center justify-center snap-start px-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl w-full">
                  <div className="text-left">
                    <h1 className="text-7xl md:text-[90px] font-black tracking-tighter leading-[0.85] mb-8 text-slate-900">
                      Neural <br /><span className="text-blue-600">SAT</span> Logic.
                    </h1>
                    <p className="text-xl text-slate-600 font-bold max-w-md mb-10 leading-relaxed">
                      Beyond tutoring. We use 3D cognitive mapping to unlock 1550+ performance.
                    </p>
                    <button onClick={() => setView('diagnostic')} className="bg-blue-600 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-blue-300">Enter Neural Lab</button>
                  </div>
                  
                  <div className="h-[500px] w-full">
                    <Canvas camera={{ position: [0, 0, 5] }}>
                      <ambientLight intensity={1.5} />
                      <pointLight position={[10, 10, 10]} intensity={2} />
                      <Suspense fallback={null}>
                        <AnimatedBrain />
                      </Suspense>
                    </Canvas>
                  </div>
                </div>
              </section>

              {/* PAGE 2: STRATEGY */}
              <section className="h-screen w-full flex flex-col items-center justify-center snap-start bg-white/30 backdrop-blur-2xl px-10">
                <h2 className="text-6xl font-black tracking-tighter mb-20 text-slate-900 text-center">Elite <span className="text-blue-600">Performance</span> Metrics.</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
                   {[
                     { t: "Cognitive Load", d: "Master the 1500+ difficulty curve with ease." },
                     { t: "Pattern Sync", d: "Identify SAT traps in under 15 seconds." },
                     { t: "Score Velocity", d: "Average 250+ point increase in 4 weeks." }
                   ].map((item, i) => (
                     <div key={i} className="bg-white p-12 rounded-[3rem] shadow-2xl border border-white text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white mb-8 mx-auto shadow-xl"><Zap /></div>
                        <h4 className="font-black text-2xl mb-4 text-slate-900">{item.t}</h4>
                        <p className="text-slate-500 font-bold leading-relaxed">{item.d}</p>
                     </div>
                   ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ADD OTHER VIEWS (Curriculum/Diagnostic) HERE using the logic from previous response */}
          
        </AnimatePresence>
      </main>
    </div>
  );
}
