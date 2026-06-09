import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Target, Award, ArrowRight, Lightbulb, BookOpen, 
  ChevronRight, CheckCircle2, RotateCcw, Zap, Shield, 
  Mail, MapPin, Layers, Cpu, Info 
} from 'lucide-react';

// MATH & 3D RENDERING
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

// DATA IMPORT
import { QUIZ_DATA } from './questions.js';

// --- 1. 3D NEURAL CORE COMPONENT ---
function AnimatedBrain() {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.4;
    mesh.current.rotation.z = Math.sin(t / 2) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh}>
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

// --- 2. MAGNETIC INTERACTION WRAPPER ---
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

// --- 3. FLUID WATER BACKGROUND ---
const WaterBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden bg-[#f0f9ff]">
    <motion.div 
      animate={{ x: [-100, 100, -100], y: [-50, 50, -50], scale: [1, 1.3, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-300/40 blur-[120px] rounded-full"
    />
    <motion.div 
      animate={{ x: [100, -100, 100], y: [50, -50, 50], scale: [1.3, 1, 1.3] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-cyan-200/40 blur-[120px] rounded-full"
    />
  </div>
);

// --- 4. COOKIE CONSENT ---
const CookieBanner = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('quasar_consent')) setShow(true);
  }, []);
  const accept = () => { localStorage.setItem('quasar_consent', 'true'); setShow(false); };

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 z-[200] bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] shadow-2xl border border-white">
          <h4 className="font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Shield size={14} className="text-blue-600"/> Neural Privacy</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">We use cognitive tracking to optimize your SAT experience. Accept to authorize neural mapping.</p>
          <div className="flex gap-3">
            <button onClick={accept} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase">Authorize</button>
            <button onClick={() => setShow(false)} className="flex-1 bg-white border border-slate-100 text-slate-500 py-3 rounded-xl text-[10px] font-black uppercase">Decline</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- 5. SOCRATIC QUIZ COMPONENT ---
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

  if (!questions.length) return <div className="pt-40 text-center font-black text-blue-600 animate-pulse">SYNCHRONIZING NEURAL PATHS...</div>;

  const q = questions[idx];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 bg-white/60 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white shadow-2xl">
        <div className="text-xs font-black text-blue-600 mb-6 tracking-[0.3em]">DIAGNOSTIC {idx + 1}/10</div>
        <div className="mb-8 p-8 bg-slate-900 text-white rounded-[2rem] text-xl leading-relaxed shadow-xl">
          {format(q.question_text)}
        </div>
        <div className="grid gap-4">
          {Object.entries(q.choices).map(([key, val]) => (
            <button 
              key={key} onClick={() => !revealed && setSelected(key)}
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5
                ${selected === key ? 'border-blue-600 bg-blue-50' : 'border-white bg-white/50 hover:bg-white'}
                ${revealed && key === q.correct_answer ? 'border-green-500 bg-green-50' : ''}
              `}
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selected === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{key}</span>
              <span className="font-bold text-slate-800 text-lg">{format(val)}</span>
            </button>
          ))}
        </div>
        <button 
          onClick={() => {
            if (!revealed) { if (selected === q.correct_answer) setScore(s => s + 1); setRevealed(true); }
            else if (idx < 9) { setIdx(i => i + 1); setSelected(null); setRevealed(false); }
            else onFinish(score);
          }}
          disabled={!selected}
          className="w-full mt-10 py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
        >
          {revealed ? "Next Challenge" : "Validate Neural Logic"}
        </button>
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white/80 p-8 rounded-[2.5rem] border border-white shadow-xl">
           <div className="flex items-center gap-2 font-black text-[10px] text-blue-600 mb-4 uppercase tracking-widest"><Lightbulb size={16}/> Socratic Hint</div>
           <p className="text-slate-600 font-medium italic leading-relaxed">{format(q.socraticHint)}</p>
        </div>
        {revealed && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl">
             <div className="font-black text-[10px] uppercase mb-3 tracking-widest text-blue-200">Trap Analysis</div>
             <p className="text-sm leading-relaxed font-bold">{format(q.trap)}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- 6. MASTER APP ---
export default function App() {
  const [view, setView] = useState('home');
  const [finalScore, setFinalScore] = useState(null);

  // Reusable Section Component for Scroll Snapping
  const Section = ({ children, className }) => (
    <section className={`h-screen w-full flex items-center justify-center snap-start shrink-0 px-10 ${className}`}>
      {children}
    </section>
  );

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-900">
      <WaterBackground />
      <CookieBanner />
      
      {/* GLOBAL GLASS NAV */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-5xl">
        <nav className="bg-white/40 backdrop-blur-3xl border border-white/50 shadow-2xl rounded-full h-20 flex items-center justify-between px-10">
          <div onClick={() => {setView('home'); setFinalScore(null);}} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl group-hover:rotate-12 transition-transform">Q</div>
            <span className="font-black tracking-tighter text-2xl">QuasarPrep</span>
          </div>
          <div className="hidden md:flex gap-10 items-center">
            <button onClick={() => setView('home')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Strategy</button>
            <button onClick={() => setView('about')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => setView('curriculum')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">Curriculum</button>
            <MagneticButton onClick={() => {setView('diagnostic'); setFinalScore(null);}} className="bg-slate-900 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Diagnostic</MagneticButton>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME */}
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar">
              <Section>
                <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl w-full">
                  <div className="text-left">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Master the Digital SAT®</motion.div>
                    <h1 className="text-7xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-8">Neural <br /><span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">SAT</span> Logic.</h1>
                    <p className="text-xl text-slate-500 font-bold max-w-md mb-12 italic leading-relaxed">The world's most advanced 1550+ diagnostic laboratory.</p>
                    <button onClick={() => setView('diagnostic')} className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-slate-900 transition-colors">Start Lab Diagnostic</button>
                  </div>
                  <div className="h-[600px] w-full">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                      <ambientLight intensity={1.5} />
                      <pointLight position={[10, 10, 10]} intensity={2} />
                      <Suspense fallback={null}><AnimatedBrain /></Suspense>
                    </Canvas>
                  </div>
                </div>
              </Section>
              <Section className="bg-white/20 backdrop-blur-xl">
                <div className="text-center max-w-5xl">
                   <h2 className="text-6xl font-black tracking-tighter mb-16">The Quasar <span className="text-blue-600">Standard.</span></h2>
                   <div className="grid md:grid-cols-3 gap-8">
                      {[{t:"Pattern Sync", d:"Identify SAT traps in 15 seconds."}, {t:"Quant Velocity", d:"Solve Math with 10 mins remaining."}, {t:"Adaptive Map", d:"Personalized neural feedback loop."}].map((f, i)=>(
                        <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white">
                          <Zap className="text-blue-600 mx-auto mb-6" />
                          <h4 className="font-black text-xl mb-2">{f.t}</h4>
                          <p className="text-slate-400 font-bold text-sm">{f.d}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </Section>
            </motion.div>
          )}

          {/* VIEW: ABOUT (As requested with specific copy) */}
          {view === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar pt-20">
              <Section>
                <div className="max-w-4xl text-center">
                  <h2 className="text-7xl font-black tracking-tighter mb-8 leading-tight text-slate-900">Master the SAT®. <br /><span className="text-blue-600">Navigate Your Future.</span></h2>
                  <p className="text-xl text-slate-500 font-bold leading-relaxed">Preparing for the SAT® shouldn’t feel like staring at static paper. We’ve built a high-performance ecosystem designed to flow at your pace.</p>
                </div>
              </Section>
              <Section className="bg-white/20">
                <div className="max-w-7xl grid lg:grid-cols-2 gap-20 items-center">
                   <div className="h-[400px]"><Canvas><ambientLight intensity={2}/><Suspense fallback={null}><AnimatedBrain /></Suspense></Canvas></div>
                   <div className="text-left space-y-6">
                      <h3 className="text-blue-600 font-black uppercase text-xs tracking-widest">Our Mission</h3>
                      <h4 className="text-4xl font-black text-slate-900 leading-tight">Clear Navigation Through Complex Testing</h4>
                      <p className="text-slate-500 text-lg font-medium leading-relaxed italic">"We don't just teach the answer; we teach you how to think, adapt, and build analytical dominance."</p>
                   </div>
                </div>
              </Section>
            </motion.div>
          )}

          {/* VIEW: CURRICULUM */}
          {view === 'curriculum' && (
            <motion.div key="curr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40 px-6 max-w-6xl mx-auto">
              <h2 className="text-7xl font-black tracking-tighter mb-20 text-center">Neural <span className="text-blue-600">Modules.</span></h2>
              <div className="grid md:grid-cols-2 gap-10">
                 <div className="bg-slate-900 p-16 rounded-[4rem] text-white shadow-2xl">
                    <Target className="text-blue-400 mb-8" size={48} />
                    <h3 className="text-4xl font-black mb-6 text-blue-400">Quant Vector</h3>
                    <p className="opacity-70 text-lg font-medium leading-relaxed mb-10">Advanced non-linear systems and coordinate geometry mapping.</p>
                    <button className="bg-blue-600 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Enter Module</button>
                 </div>
                 <div className="bg-white p-16 rounded-[4rem] text-slate-900 border border-slate-100 shadow-2xl">
                    <Award className="text-blue-600 mb-8" size={48} />
                    <h3 className="text-4xl font-black mb-6">Rhetoric Engine</h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">Complex inference and structural transition logic.</p>
                    <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Enter Module</button>
                 </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: DIAGNOSTIC (The Quiz) */}
          {view === 'diagnostic' && (
            <motion.div key="diag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
              {finalScore === null ? (
                <DiagnosticQuiz onFinish={(s) => setFinalScore(s)} />
              ) : (
                <div className="max-w-2xl mx-auto py-20 px-6 text-center">
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-20 rounded-[5rem] shadow-2xl border border-white">
                    <Award size={100} className="text-blue-600 mx-auto mb-8" />
                    <h2 className="text-4xl font-black text-slate-400 uppercase tracking-widest mb-4">Neural Result</h2>
                    <div className="text-[120px] font-black text-slate-900 leading-none mb-10 tracking-tighter">
                      {Math.round((finalScore / 10) * 800 + 800)}
                    </div>
                    <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest flex items-center gap-4 mx-auto hover:bg-blue-600 transition-colors shadow-xl">
                      <RotateCcw /> Reset Diagnostic
                    </button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* VIEW: LEGAL (Privacy/Terms) */}
          {(view === 'privacy' || view === 'terms') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-48 px-10 max-w-3xl mx-auto pb-40">
              <h2 className="text-4xl font-black uppercase mb-10 tracking-[0.3em] text-slate-400">{view} Protocol</h2>
              <div className="bg-white/80 backdrop-blur-xl p-16 rounded-[4rem] shadow-2xl border border-white">
                <p className="font-bold text-slate-800 mb-8">Effective Date: June 2024</p>
                <div className="space-y-6 text-slate-500 font-medium leading-relaxed">
                  <p>Usage of the QuasarPrep diagnostic platform is governed by academic integrity protocols. All neural data collected is encrypted via AES-256 standards.</p>
                  <p>By accessing the 3D lab, you agree to comply with international educational standards. QuasarPrep is an independent research lab and is not affiliated with the College Board.</p>
                </div>
                <button onClick={() => setView('home')} className="mt-10 font-black text-blue-600 text-[10px] uppercase tracking-widest underline decoration-2 underline-offset-8">Return to Lab</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 bg-white/60 backdrop-blur-md border-t border-slate-200 py-16 px-10 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">Q</div>
                <span className="font-black text-xl tracking-tighter">QuasarPrep Academic</span>
              </div>
              <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-sm italic">"Elevating human intelligence through architectural cognitive design."</p>
            </div>
            <div className="flex flex-col gap-4">
              <h5 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Strategy</h5>
              <button onClick={()=>setView('about')} className="text-left text-xs font-black text-slate-600 hover:text-blue-600">The Method</button>
              <button onClick={()=>setView('privacy')} className="text-left text-xs font-black text-slate-600 hover:text-blue-600">Privacy Protocol</button>
            </div>
            <div className="flex flex-col gap-4">
              <h5 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Connect</h5>
              <a href="mailto:lab@quasarprep.com" className="text-left text-xs font-black text-slate-600 hover:text-blue-600">Lab Support</a>
              <div className="text-[10px] text-slate-400 font-bold">© 2024 QuasarPrep. Ivy League Standard.</div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 text-center">
            <p className="text-[9px] text-slate-400 uppercase tracking-widest italic leading-relaxed">
              SAT® is a registered trademark of the College Board, which is not affiliated with, and does not endorse, this website.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
