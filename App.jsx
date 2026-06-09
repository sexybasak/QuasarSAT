import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Award, ArrowRight, Lightbulb, BookOpen, ChevronRight, CheckCircle2, RotateCcw, Zap } from 'lucide-react';

// MATH & 3D IMPORTS (Ensure these are in your package.json)
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

// Import your questions (Ensure questions.js exists in the same folder)
import { QUIZ_DATA } from './questions.js';

// --- 1. 3D BRAIN COMPONENT ---
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
        <Sphere args={[1, 100, 100]} scale={2.4}>
          <MeshDistortMaterial
            color="#3b82f6"
            attach="material"
            distort={0.4}
            speed={3}
            roughness={0.1}
            metalness={0.9}
          />
        </Sphere>
      </mesh>
    </Float>
  );
}

// --- 2. MAGNETIC BUTTON COMPONENT ---
const MagneticButton = ({ children, onClick, className }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const move = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
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

// --- 3. MOVING WATER BACKGROUND ---
const WaterBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#eef6ff]">
    <motion.div 
      animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-10%] w-full h-full bg-blue-200/40 blur-[120px] rounded-full"
    />
    <motion.div 
      animate={{ x: [0, -50, 0], y: [0, -30, 0], rotate: -360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-20%] right-[-10%] w-full h-full bg-cyan-100/30 blur-[120px] rounded-full"
    />
  </div>
);

// --- 4. THE QUIZ MODULE (Integrated) ---
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

  if (!questions.length) return <div className="pt-40 text-center font-black">CALIBRATING NEURAL PATHS...</div>;

  const q = questions[idx];
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl">
        <div className="text-xs font-black text-blue-600 mb-4 tracking-widest">STEP {idx + 1} OF 10</div>
        <div className="mb-8 p-6 bg-slate-900 text-white rounded-2xl text-lg leading-relaxed">
          {format(q.question_text)}
        </div>
        <div className="space-y-3">
          {Object.entries(q.choices).map(([key, val]) => (
            <button 
              key={key}
              onClick={() => !revealed && setSelected(key)}
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-4
                ${selected === key ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'}
                ${revealed && key === q.correct_answer ? 'border-green-500 bg-green-50' : ''}
              `}
            >
              <span className="font-black text-blue-600">{key}</span>
              <span className="font-bold">{format(val)}</span>
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
          className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest"
        >
          {revealed ? "Next Challenge" : "Validate Selection"}
        </button>
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white/80 p-8 rounded-3xl border border-white shadow-xl">
           <div className="flex items-center gap-2 font-black text-xs text-blue-600 mb-4 uppercase"><Lightbulb size={16}/> Socratic Clue</div>
           <p className="text-slate-600 text-sm italic">{format(q.socraticHint)}</p>
        </div>
        {revealed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-900 p-8 rounded-3xl text-white shadow-2xl">
             <div className="font-black text-xs uppercase mb-2 tracking-widest text-blue-300">Logical Proof</div>
             <p className="text-sm leading-relaxed">{format(q.reasoning)}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- 5. MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState('home'); // home, curriculum, diagnostic
  const [finalScore, setFinalScore] = useState(null);

  return (
    <div className="relative min-h-screen font-sans">
      <WaterBackground />
      
      {/* GLOBAL NAVIGATION */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-full h-16 flex items-center justify-between px-8">
          <div onClick={() => setView('home')} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg">Q</div>
            <span className="font-black tracking-tighter text-xl">QuasarPrep</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <MagneticButton onClick={() => setView('home')} className="text-[10px] font-black uppercase tracking-widest text-slate-500">Home</MagneticButton>
            <MagneticButton onClick={() => setView('curriculum')} className="text-[10px] font-black uppercase tracking-widest text-slate-500">Curriculum</MagneticButton>
            <MagneticButton onClick={() => setView('diagnostic')} className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Start Quiz</MagneticButton>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="pt-32 pb-20">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth no-scrollbar">
              
              {/* Hero Section */}
              <section className="h-screen flex flex-col items-center justify-center px-6 snap-start">
                <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl">
                  <div className="text-left">
                    <h1 className="text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                      Neural <br /><span className="text-blue-600">SAT</span> Logic.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-md mb-10">Targeting the 1550+ ceiling via socratic 3D cognitive mapping.</p>
                    <MagneticButton onClick={() => setView('diagnostic')} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-200">Start Diagnostic</MagneticButton>
                  </div>
                  <div className="h-[500px]">
                    <Canvas>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <Suspense fallback={null}>
                        <AnimatedBrain />
                      </Suspense>
                    </Canvas>
                  </div>
                </div>
              </section>

              {/* Detail Section */}
              <section className="h-screen flex flex-col items-center justify-center snap-start bg-white/40 backdrop-blur-md">
                <h2 className="text-6xl font-black tracking-tight mb-16 text-center">Engineered for <span className="text-blue-600">Ivy Admissions.</span></h2>
                <div className="grid md:grid-cols-3 gap-10 max-w-6xl px-6">
                   {[
                     { t: "Cognitive Speed", d: "Solve Math modules with 12 mins remaining." },
                     { t: "Rhetorical Logic", d: "Deconstruct Reading passages in 45 seconds." },
                     { t: "Strategic Depth", d: "Eliminate traps with 99.9% precision." }
                   ].map((item, i) => (
                     <div key={i} className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white">
                        <Zap className="text-blue-600 mb-6" size={32} />
                        <h4 className="font-black text-xl mb-4">{item.t}</h4>
                        <p className="text-slate-500 font-medium">{item.d}</p>
                     </div>
                   ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'curriculum' && (
            <motion.div key="curr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto px-6 py-20 text-center">
              <h2 className="text-7xl font-black tracking-tighter mb-16">The 1500+ Blueprint.</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-12 rounded-[3rem] text-white text-left">
                   <Target className="text-blue-400 mb-6" size={40}/>
                   <h3 className="text-3xl font-black mb-4 text-blue-400">Quantitative Vector</h3>
                   <p className="opacity-70 mb-8 font-medium">Advanced algebraic modeling and nonlinear data synthesis.</p>
                   <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">Explore Math</button>
                </div>
                <div className="bg-white p-12 rounded-[3rem] text-slate-900 text-left border-4 border-slate-900 shadow-2xl">
                   <Award className="text-blue-600 mb-6" size={40}/>
                   <h3 className="text-3xl font-black mb-4">Verbal Synthesis</h3>
                   <p className="text-slate-500 mb-8 font-medium">Critical rhetorical analysis and structural grammar mapping.</p>
                   <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">Explore Verbal</button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'diagnostic' && (
            <motion.div key="diag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {finalScore === null ? (
                <DiagnosticQuiz onFinish={(s) => setFinalScore(s)} />
              ) : (
                <div className="max-w-2xl mx-auto py-20 text-center">
                  <div className="bg-white p-16 rounded-[4rem] shadow-2xl border border-white">
                    <Award size={80} className="text-blue-600 mx-auto mb-6" />
                    <h2 className="text-5xl font-black tracking-tighter mb-4">Calibrated.</h2>
                    <div className="text-8xl font-black text-slate-900 mb-10">
                      {Math.round((finalScore / 10) * 800 + 800)}
                    </div>
                    <button onClick={() => window.location.reload()} className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black mx-auto">
                      <RotateCcw size={20}/> Re-calibrate
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
