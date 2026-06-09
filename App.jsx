import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Target, Award, ArrowRight, Lightbulb, BookOpen, 
  ChevronRight, CheckCircle2, RotateCcw, Zap, Shield, 
  Mail, MapPin, Layers, Cpu, Info, Search 
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

// --- 2. FLUID WATER BACKGROUND ---
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

// --- 3. MAGNETIC INTERACTION WRAPPER ---
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
      ref={ref} onMouseMove={move} onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={onClick} animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// --- 4. THE QUIZ LOGIC (Socratic Engine) ---
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

  if (!questions.length) return <div className="pt-40 text-center font-black text-blue-600">INITIALIZING NEURAL PATHS...</div>;

  const q = questions[idx];
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 bg-white/60 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white shadow-2xl">
        <div className="text-xs font-black text-blue-600 mb-6 tracking-widest uppercase">Diagnostic Assessment {idx + 1}/10</div>
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
          {revealed ? "Next Challenge" : "Validate Selection"}
        </button>
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white/80 p-8 rounded-[2.5rem] border border-white shadow-xl">
           <div className="flex items-center gap-2 font-black text-[10px] text-blue-600 mb-4 uppercase tracking-widest"><Lightbulb size={16}/> Socratic Clue</div>
           <p className="text-slate-600 font-medium italic leading-relaxed">{format(q.socraticHint)}</p>
        </div>
        {revealed && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl">
             <div className="font-black text-[10px] uppercase mb-3 tracking-widest text-blue-200">The Logical Proof</div>
             <p className="text-sm leading-relaxed font-bold">{format(q.reasoning)}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- 5. MAIN APPLICATION (The Controller) ---
export default function App() {
  const [view, setView] = useState('home');
  const [finalScore, setFinalScore] = useState(null);

  const Section = ({ children, className }) => (
    <section className={`h-screen w-full flex items-center justify-center snap-start shrink-0 px-10 ${className}`}>
      {children}
    </section>
  );

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-900">
      <WaterBackground />
      
      {/* NAVIGATIONBAR */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-5xl">
        <nav className="bg-white/40 backdrop-blur-3xl border border-white/50 shadow-2xl rounded-full h-20 flex items-center justify-between px-10">
          <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl group-hover:rotate-12 transition-transform">Q</div>
            <span className="font-black tracking-tighter text-2xl">QuasarPrep</span>
          </div>
          <div className="hidden md:flex gap-10 items-center">
            <button onClick={() => setView('home')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">Strategy</button>
            <button onClick={() => setView('about')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">About</button>
            <button onClick={() => setView('curriculum')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">Curriculum</button>
            <MagneticButton onClick={() => setView('diagnostic')} className="bg-slate-900 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-600">Diagnostic</MagneticButton>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4 underline decoration-4 underline-offset-8">1550+ Cognitive Map</motion.div>
                    <h1 className="text-7xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-8">Neural <br /><span className="text-blue-600">SAT</span> Logic.</h1>
                    <p className="text-xl text-slate-500 font-bold max-w-md mb-12 italic leading-relaxed">Deconstruct the Digital SAT® using advanced pattern synthesis.</p>
                    <button onClick={() => setView('diagnostic')} className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl">Enter Neural Lab</button>
                  </div>
                  <div className="h-[600px] w-full">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                      <ambientLight intensity={1.5} /><Suspense fallback={null}><AnimatedBrain /></Suspense>
                    </Canvas>
                  </div>
                </div>
              </Section>
            </motion.div>
          )}

          {/* VIEW: ABOUT (As Requested) */}
          {view === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar">
              
              {/* Headline & Intro */}
              <Section>
                <div className="max-w-4xl text-center">
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-10 text-slate-900">
                    Master the SAT®. <br /> <span className="text-blue-600">Navigate Your Future.</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-slate-600 font-bold leading-relaxed max-w-3xl mx-auto">
                    At QuasarPrep, we believe that preparing for the SAT® shouldn’t feel like staring at static paper or memorizing rigid rules. The digital SAT® is dynamic, adaptive, and precise—and your prep platform should be too.
                  </p>
                </div>
              </Section>

              {/* Section 1: Mission */}
              <Section className="bg-white/20 backdrop-blur-xl">
                <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl">
                  <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 1 }} className="space-y-6">
                    <h3 className="text-blue-600 font-black uppercase text-xs tracking-widest">Section 1: Our Mission</h3>
                    <h4 className="text-5xl font-black text-slate-900 leading-tight">Clear Navigation Through Complex Testing</h4>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                      Every student’s learning journey is fluid. Our mission is to guide you through the complexities of the digital SAT® with absolute clarity. We don't just teach you how to find the answer; we teach you how to think, adapt, and build the deep analytical skills required for a top-tier score.
                    </p>
                  </motion.div>
                  <div className="h-[500px]">
                    <Canvas><ambientLight intensity={1.5}/><Suspense fallback={null}><AnimatedBrain /></Suspense></Canvas>
                  </div>
                </div>
              </Section>

              {/* Section 2: Pillars */}
              <Section>
                <div className="max-w-7xl w-full">
                  <h3 className="text-center font-black text-xs uppercase tracking-[0.4em] text-slate-400 mb-16">Section 2: The Core Pillars</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { title: "Adaptive 3D Visualizations", desc: "We bring abstract math and data analysis to life. Our unique interface helps you visualize complex geometric transformations and algebraic relationships." },
                      { title: "True Algorithmic Precision", desc: "Our mock testing environments and targeted modules are built to mirror the exact structure of the adaptive digital SAT®." },
                      { title: "Built for the Digital Era", desc: "From mastering the native Desmos graphing calculator to utilizing smart elimination, we weaponize you with exact technical skills." }
                    ].map((pillar, i) => (
                      <motion.div key={i} whileHover={{ y: -10 }} className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl hover:bg-white transition-all group">
                         <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform"><Layers size={24}/></div>
                         <h4 className="font-black text-xl mb-4">{pillar.title}</h4>
                         <p className="text-slate-500 text-sm font-bold leading-relaxed">{pillar.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Section>

              {/* Section 3: Integrity */}
              <Section className="bg-slate-900 text-white">
                <div className="max-w-4xl text-center space-y-8 px-6">
                  <h3 className="text-blue-400 font-black uppercase text-xs tracking-widest">Section 3: Our Commitment to Integrity</h3>
                  <h4 className="text-5xl font-black leading-tight">Academic Integrity & Excellence</h4>
                  <p className="text-lg opacity-70 font-medium leading-relaxed">
                    We are deeply committed to providing an honest, high-impact learning environment. All our diagnostic modules and practice questions are uniquely engineered by subject matter experts to reflect the latest testing standards without violating copyright or reproducing official Bluebook™ materials.
                  </p>
                  <button onClick={() => setView('diagnostic')} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest">Start Free Diagnostic</button>
                </div>
              </Section>
            </motion.div>
          )}

          {/* VIEW: CURRICULUM */}
          {view === 'curriculum' && (
            <motion.div key="curr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40 max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-7xl font-black tracking-tighter mb-20 text-slate-900">Neural <span className="text-blue-600">Modules.</span></h2>
              <div className="grid md:grid-cols-2 gap-12 text-left">
                <div className="bg-slate-900 p-16 rounded-[4rem] text-white shadow-2xl">
                  <Target className="text-blue-400 mb-8" size={48} />
                  <h3 className="text-4xl font-black mb-6 text-blue-400">Quant Vector</h3>
                  <p className="opacity-70 text-lg font-medium leading-relaxed">Advanced algebraic modeling, non-linear systems, and coordinate geometry synthesis.</p>
                </div>
                <div className="bg-white p-16 rounded-[4rem] text-slate-900 border border-slate-100 shadow-2xl">
                  <Award className="text-blue-600 mb-8" size={48} />
                  <h3 className="text-4xl font-black mb-6">Verbal Synthesis</h3>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">Rhetorical analysis, structural transitions, and complex inference mapping.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: DIAGNOSTIC */}
          {view === 'diagnostic' && (
            <motion.div key="diag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40">
              {finalScore === null ? (
                <DiagnosticQuiz onFinish={(s) => setFinalScore(s)} />
              ) : (
                <div className="max-w-2xl mx-auto py-20 text-center px-6">
                  <div className="bg-white p-20 rounded-[5rem] shadow-2xl border border-white">
                    <Award size={100} className="text-blue-600 mx-auto mb-8" />
                    <h2 className="text-4xl font-black text-slate-400 uppercase tracking-widest mb-4">Neural Calibrated Score</h2>
                    <div className="text-[120px] font-black text-slate-900 leading-none mb-10 tracking-tighter">
                      {Math.round((finalScore / 10) * 800 + 800)}
                    </div>
                    <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 mx-auto shadow-xl"><RotateCcw/> Reset Lab</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER (With Section 4 Disclaimer) */}
      <footer className="relative z-10 bg-white/60 backdrop-blur-md border-t border-slate-200 py-20 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6 font-black text-2xl tracking-tighter">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-base">Q</div>
                QuasarPrep
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose max-w-sm">Elevating the next generation of global scholars via architectural cognitive design.</p>
            </div>
            <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
               <button onClick={()=>setView('about')} className="text-left hover:text-blue-600">The Mission</button>
               <button onClick={()=>setView('curriculum')} className="text-left hover:text-blue-600">The Curriculum</button>
            </div>
            <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
               <a href="mailto:contact@quasarprep.com" className="text-left hover:text-blue-600">Lab Support</a>
               <span>© 2024 QuasarPrep Academic</span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-10 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest max-w-4xl mx-auto leading-relaxed">
              Section 4: Mandatory Disclaimer — SAT® is a registered trademark of the College Board, which is not affiliated with, and does not endorse, this website.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
