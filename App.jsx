import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Award, ArrowRight, Lightbulb, BookOpen, ChevronRight, CheckCircle2, RotateCcw, Zap } from 'lucide-react';

// MATH & 3D IMPORTS
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, MeshGradientMaterial } from '@react-three/drei';

// Import your questions (Ensure questions.js exists)
import { QUIZ_DATA } from './questions.js';

// --- 1. 3D BRAIN COMPONENT (Fixed Sizing) ---
function AnimatedBrain() {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.cos(t / 4) * 0.2;
    mesh.current.rotation.y = Math.sin(t / 4) * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh}>
        {/* We use an Icosahedron for a more "Neural/Tech" brain look */}
        <icosahedronGeometry args={[1, 15]} /> 
        <MeshDistortMaterial
          color="#2563eb"
          attach="material"
          distort={0.5}
          speed={4}
          roughness={0}
          metalness={1}
        />
      </mesh>
    </Float>
  );
}

// --- 2. THE LIQUID WATER BACKGROUND (Enhanced Visibility) ---
const WaterBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#e0f2fe]">
    {/* Deep Blue Blob */}
    <motion.div 
      animate={{ 
        x: [0, 100, 0], 
        y: [0, 50, 0],
        scale: [1, 1.2, 1] 
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-blue-400/40 blur-[100px] rounded-full"
    />
    {/* Cyan Liquid Blob */}
    <motion.div 
      animate={{ 
        x: [0, -100, 0], 
        y: [0, -50, 0],
        scale: [1.2, 1, 1.2] 
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-300/40 blur-[100px] rounded-full"
    />
    {/* Purple "Flow" Blob */}
    <motion.div 
      animate={{ 
        rotate: 360,
        x: [-50, 50, -50]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-300/30 blur-[120px] rounded-full"
    />
  </div>
);

// --- 3. MAGNETIC BUTTON COMPONENT ---
const MagneticButton = ({ children, onClick, className }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const move = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.4;
    const y = (clientY - (top + height / 2)) * 0.4;
    setPos({ x, y });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={move}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={onClick}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// --- 4. THE QUIZ MODULE ---
const DiagnosticQuiz = ({ onFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const q = [...QUIZ_DATA].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(q);
  }, []);

  const format = (t) => {
    if (typeof t !== 'string') return t;
    return t.split(/(\$.*?\$)/g).map((p, i) => 
      p.startsWith('$') ? <InlineMath key={i} math={p.slice(1, -1)} /> : p
    );
  };

  if (!questions.length) return <div className="pt-40 text-center font-black text-blue-600">LOADING NEURAL PATHS...</div>;

  const q = questions[idx];
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10 relative z-10">
      <div className="lg:col-span-8 bg-white/60 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-2xl">
        <div className="text-xs font-black text-blue-600 mb-4 tracking-widest uppercase">Question {idx + 1} of 10</div>
        <div className="mb-8 p-8 bg-slate-900 text-white rounded-[2rem] text-xl leading-relaxed shadow-xl">
          {format(q.question_text)}
        </div>
        <div className="grid gap-4">
          {Object.entries(q.choices).map(([key, val]) => (
            <button 
              key={key}
              onClick={() => !revealed && setSelected(key)}
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-4
                ${selected === key ? 'border-blue-600 bg-blue-50' : 'border-white bg-white/50 hover:bg-white'}
                ${revealed && key === q.correct_answer ? 'border-green-500 bg-green-50' : ''}
              `}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${selected === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{key}</span>
              <span className="font-bold text-slate-800">{format(val)}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={() => {
            if (!revealed) {
              if (selected === q.correct_answer) setScore(s => s + 1);
              setRevealed(true);
            } else if (idx < 9) {
              setIdx(i => i + 1); setSelected(null); setRevealed(false);
            } else {
              onFinish(score);
            }
          }}
          disabled={!selected}
          className="w-full mt-10 py-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-xl shadow-blue-200"
        >
          {revealed ? "Next Challenge" : "Validate Logic"}
        </button>
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl">
           <div className="flex items-center gap-2 font-black text-[10px] text-blue-600 mb-4 uppercase tracking-widest"><Lightbulb size={16}/> Socratic Clue</div>
           <p className="text-slate-600 font-medium italic leading-relaxed">{format(q.socraticHint)}</p>
        </div>
        {revealed && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
             <div className="font-black text-[10px] uppercase mb-3 tracking-[0.2em] text-blue-400">Strategic Reasoning</div>
             <p className="text-sm leading-relaxed opacity-90">{format(q.reasoning)}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- 5. MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState('home'); 
  const [finalScore, setFinalScore] = useState(null);

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc]">
      <WaterBackground />
      
      {/* GLASS NAVIGATION */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-5xl">
        <div className="bg-white/40 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-full h-20 flex items-center justify-between px-10">
          <div onClick={() => {setView('home'); setFinalScore(null);}} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl">Q</div>
            <span className="font-black tracking-tighter text-2xl text-slate-900">QuasarPrep</span>
          </div>
          <div className="hidden md:flex gap-10 items-center">
            <MagneticButton onClick={() => setView('home')} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600">Strategy</MagneticButton>
            <MagneticButton onClick={() => setView('curriculum')} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600">Curriculum</MagneticButton>
            <MagneticButton onClick={() => {setView('diagnostic'); setFinalScore(null);}} className="bg-slate-900 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg">Start Diagnostic</MagneticButton>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home" 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar"
            >
              {/* HERO SECTION */}
              <section className="h-screen w-full flex flex-col items-center justify-center px-6 snap-start shrink-0">
                <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl w-full">
                  <div className="text-left z-20">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4">Elite SAT Coaching</motion.div>
                    <h1 className="text-7xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-10 text-slate-900">
                      Neural <br /><span className="text-blue-600">SAT</span> Logic.
                    </h1>
                    <p className="text-xl text-slate-500 font-semibold max-w-md mb-12 leading-relaxed">
                      Targeting 1550+ scores through 3D cognitive mapping and Socratic analysis.
                    </p>
                    <MagneticButton onClick={() => setView('diagnostic')} className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 text-sm">Initialize diagnostic</MagneticButton>
                  </div>
                  
                  {/* 3D BRAIN CONTAINER */}
                  <div className="h-[600px] w-full relative z-10">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                      <ambientLight intensity={1} />
                      <pointLight position={[10, 10, 10]} intensity={2} />
                      <Suspense fallback={null}>
                        <AnimatedBrain />
                      </Suspense>
                    </Canvas>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 animate-pulse">Interactive Neural Core</div>
                  </div>
                </div>
              </section>

              {/* FEATURES SECTION */}
              <section className="h-screen w-full flex flex-col items-center justify-center snap-start shrink-0 bg-white/20 backdrop-blur-xl">
                <div className="max-w-6xl px-6 text-center">
                  <h2 className="text-6xl font-black tracking-tighter mb-20 text-slate-900">Engineered for <span className="text-blue-600">The 99th Percentile.</span></h2>
                  <div className="grid md:grid-cols-3 gap-8">
                     {[
                       { t: "Cognitive Speed", d: "Finish Math modules with 10+ minutes to spare." },
                       { t: "Rhetorical Depth", d: "Identify 1500+ level traps in 30 seconds." },
                       { t: "Predictive AI", d: "Every question adapts to your unique neural map." }
                     ].map((item, i) => (
                       <motion.div whileHover={{ y: -10 }} key={i} className="bg-white/80 p-12 rounded-[3.5rem] shadow-2xl border border-white">
                          <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-8 mx-auto"><Zap fill="currentColor"/></div>
                          <h4 className="font-black text-2xl mb-4 text-slate-900">{item.t}</h4>
                          <p className="text-slate-500 font-bold leading-relaxed">{item.d}</p>
                       </motion.div>
                     ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'curriculum' && (
            <motion.div key="curr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-40 px-6 max-w-6xl mx-auto text-center">
              <h2 className="text-8xl font-black tracking-tighter mb-10">Curriculum</h2>
              <p className="text-slate-500 text-2xl font-bold mb-20 italic">"The blueprint for a 1600."</p>
              <div className="grid md:grid-cols-2 gap-10">
                 <div className="bg-slate-900 p-16 rounded-[4rem] text-white text-left shadow-2xl">
                    <Target className="text-blue-400 mb-8" size={48} />
                    <h3 className="text-4xl font-black mb-6">Quant Synthesis</h3>
                    <p className="text-blue-100/60 text-lg font-medium mb-10 leading-relaxed">Master non-linear systems, advanced trigonometry, and digital SAT calculator shortcuts.</p>
                    <button className="bg-blue-600 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Access Module</button>
                 </div>
                 <div className="bg-white p-16 rounded-[4rem] text-slate-900 text-left shadow-2xl border border-slate-100">
                    <Award className="text-blue-600 mb-8" size={48} />
                    <h3 className="text-4xl font-black mb-6">Verbal Logic</h3>
                    <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">Cross-textual analysis and rhetorical structure mapping for 750+ score range.</p>
                    <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Access Module</button>
                 </div>
              </div>
            </motion.div>
          )}

          {view === 'diagnostic' && (
            <motion.div key="diag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
              {finalScore === null ? (
                <DiagnosticQuiz onFinish={(s) => setFinalScore(s)} />
              ) : (
                <div className="max-w-2xl mx-auto py-20 px-6 text-center">
                  <div className="bg-white p-20 rounded-[5rem] shadow-2xl border border-white">
                    <Award size={100} className="text-blue-600 mx-auto mb-8" />
                    <h2 className="text-4xl font-black text-slate-400 uppercase tracking-widest mb-4">Calibrated Result</h2>
                    <div className="text-[120px] font-black text-slate-900 leading-none mb-10 tracking-tighter">
                      {Math.round((finalScore / 10) * 800 + 800)}
                    </div>
                    <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest flex items-center gap-4 mx-auto hover:bg-blue-600 transition-colors">
                      <RotateCcw /> Retake Assessment
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
