import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Target, Award, ArrowRight, Lightbulb, BookOpen, 
  ChevronRight, CheckCircle2, RotateCcw, Zap, Shield, 
  Mail, MapPin, Layers, Cpu, Info, Search, MessageCircle, Phone,
  FileText, Lock, ShieldCheck, RefreshCcw, ArrowLeft, ExternalLink
} from 'lucide-react';

// EXTERNAL COMPONENT
import Pricing from './Pricing'; 

// MATH & 3D RENDERING
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

// DATA IMPORT
import { QUIZ_DATA } from './questions.js';

// --- LEGAL CONTENT DATA ---
const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Policy",
    icon: Lock,
    lastUpdated: "June 10, 2026",
    sections: [
      {
        heading: "Information We Collect",
        content: "We collect information that you provide directly to us, including name, email address, phone number, and payment information when you register for our services. We also collect usage data and analytics to improve your learning experience."
      },
      {
        heading: "How We Use Your Information",
        content: "Your information is used to provide personalized SAT preparation services, process payments, send educational content and updates, and improve our adaptive learning algorithms. We do not sell your personal data to third parties."
      },
      {
        heading: "Data Security",
        content: "We implement industry-standard encryption and security measures to protect your personal information. All data is stored on secure servers with regular security audits and compliance checks."
      },
      {
        heading: "Cookies & Tracking",
        content: "We use cookies to enhance your experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences."
      },
      {
        heading: "Third-Party Services",
        content: "We may use trusted third-party services for payment processing (Stripe), analytics (Google Analytics), and communication (SendGrid). These services have their own privacy policies and are GDPR compliant."
      },
      {
        heading: "Your Rights",
        content: "You have the right to access, correct, or delete your personal data. You may also request a copy of your data or withdraw consent for marketing communications at any time by contacting us."
      }
    ]
  },
  terms: {
    title: "Terms & Conditions",
    icon: FileText,
    lastUpdated: "June 10, 2026",
    sections: [
      {
        heading: "Acceptance of Terms",
        content: "By accessing QuasarPrep, you agree to these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services. These terms apply to all visitors, users, and others who access the service."
      },
      {
        heading: "Use of Services",
        content: "QuasarPrep provides digital SAT preparation materials, practice tests, and tutoring services. You agree to use these services for personal educational purposes only. Sharing account credentials or reselling content is strictly prohibited."
      },
      {
        heading: "Intellectual Property",
        content: "All content, including practice questions, explanatory videos, study materials, and software, is the intellectual property of QuasarPrep. Unauthorized reproduction, distribution, or creation of derivative works is prohibited."
      },
      {
        heading: "User Conduct",
        content: "You agree not to use the service for any unlawful purpose, interfere with other users' access, attempt to breach security measures, or upload malicious content. Violation may result in immediate termination of your account."
      },
      {
        heading: "Disclaimer",
        content: "QuasarPrep is an independent preparation platform and is not affiliated with the College Board. SAT® is a registered trademark of the College Board. We do not guarantee specific score improvements."
      },
      {
        heading: "Limitation of Liability",
        content: "QuasarPrep shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid for the service in the preceding 12 months."
      }
    ]
  },
  refund: {
    title: "Refund Policy",
    icon: RefreshCcw,
    lastUpdated: "June 10, 2026",
    sections: [
      {
        heading: "Eligibility for Refunds",
        content: "We offer a 7-day money-back guarantee for all new subscriptions. To be eligible, you must have accessed less than 20% of the course content and not taken more than one diagnostic assessment. Refund requests must be made within 7 days of purchase."
      },
      {
        heading: "How to Request a Refund",
        content: "To request a refund, contact our support team at quasarprep@quasarprep.online or via WhatsApp with your order details. Refund requests are processed within 5-7 business days. The refund will be issued to the original payment method."
      },
      {
        heading: "Partial Refunds & Prorated Credits",
        content: "After the 7-day guarantee period, we may offer prorated credits for unused months on annual plans in cases of documented technical issues or extenuating circumstances. Monthly plans are not eligible for partial refunds after the guarantee period."
      },
      {
        heading: "Non-Refundable Items",
        content: "One-time tutoring sessions, printed study materials, and digital downloads are non-refundable once accessed or shipped. Bootcamp registrations are non-refundable within 14 days of the start date."
      },
      {
        heading: "Subscription Cancellations",
        content: "You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of the current billing cycle. You will retain access until the cycle ends, but no partial refunds will be issued for unused days."
      },
      {
        heading: "Dispute Resolution",
        content: "If you are unsatisfied with our refund decision, you may escalate to our management team. We aim to resolve all disputes amicably within 14 business days. For unresolved disputes, binding arbitration may apply as per our full terms."
      }
    ]
  }
};

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

// --- 4. LEGAL PAGE COMPONENT ---
const LegalPage = ({ type, onBack }) => {
  const content = LEGAL_CONTENT[type];
  const Icon = content.icon;

  return (
    <motion.div 
      key={type}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <motion.button
          onClick={onBack}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase tracking-widest mb-8 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} />
          Return to Site
        </motion.button>

        {/* Header */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl p-12 md:p-16 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Icon size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                {content.title}
              </h1>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">
                Last Updated: {content.lastUpdated}
              </p>
            </div>
          </div>
          <p className="text-slate-600 font-medium leading-relaxed">
            Please read these {content.title.toLowerCase()} carefully before using QuasarPrep services. 
            By accessing our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {content.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl p-10 md:p-12 hover:bg-white/60 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-sm shrink-0 mt-1">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                    {section.heading}
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed text-[15px]">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl">
          <h3 className="text-2xl font-black text-white mb-4">Questions About Our Policies?</h3>
          <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto">
            Our academic support team is available to clarify any concerns regarding your privacy, rights, or refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:quasarprep@quasarprep.online" 
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-colors"
            >
              <Mail size={16} />
              Email Support
            </a>
            <a 
              href="https://wa.me/917061014213" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <button 
            onClick={onBack}
            className="text-slate-400 text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            ← Back to QuasarPrep Home
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- 5. THE QUIZ LOGIC (Socratic Engine) ---
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

// --- 6. MAIN APPLICATION ---
export default function App() {
  const [view, setView] = useState('home');
  const [finalScore, setFinalScore] = useState(null);

  const Section = ({ children, className }) => (
    <section className={`h-screen w-full flex items-center justify-center snap-start shrink-0 px-10 ${className}`}>
      {children}
    </section>
  );

  // Navigation handler that preserves scroll
  const handleNav = (newView) => {
    setView(newView);
    setFinalScore(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-900">
      <WaterBackground />
      
      {/* WHATSAPP WIDGET */}
      <motion.a 
        href="https://wa.me/917061014213" target="_blank" rel="noopener noreferrer"
        initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 left-8 z-[200] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
      >
        <MessageCircle size={32} fill="white" />
      </motion.a>

      {/* NAVIGATION BAR */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-5xl">
        <nav className="bg-white/40 backdrop-blur-3xl border border-white/50 shadow-2xl rounded-full h-20 flex items-center justify-between px-10">
          <div onClick={() => handleNav('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl group-hover:rotate-12 transition-transform">Q</div>
            <span className="font-black tracking-tighter text-2xl">QuasarPrep</span>
          </div>
          <div className="hidden md:flex gap-10 items-center">
            <button onClick={() => handleNav('home')} className={`text-[11px] font-black uppercase tracking-widest transition-colors ${view === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Strategy</button>
            <button onClick={() => handleNav('about')} className={`text-[11px] font-black uppercase tracking-widest transition-colors ${view === 'about' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>About</button>
            <button onClick={() => handleNav('curriculum')} className={`text-[11px] font-black uppercase tracking-widest transition-colors ${view === 'curriculum' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Curriculum</button>
            <button onClick={() => handleNav('pricing')} className={`text-[11px] font-black uppercase tracking-widest transition-colors ${view === 'pricing' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Pricing</button>
            <MagneticButton onClick={() => handleNav('diagnostic')} className="bg-slate-900 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Diagnostic</MagneticButton>
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
                    <button onClick={() => handleNav('diagnostic')} className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl">Enter Neural Lab</button>
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

          {/* VIEW: ABOUT */}
          {view === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar">
              <Section>
                <div className="max-w-4xl text-center">
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-10 text-slate-900">
                    Master the SAT®. <br /> <span className="text-blue-600">Navigate Your Future.</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-slate-600 font-bold leading-relaxed max-w-3xl mx-auto">
                    At QuasarPrep, we believe that preparing for the SAT® shouldn't feel like staring at static paper or memorizing rigid rules. The digital SAT® is dynamic, adaptive, and precise—and your prep platform should be too.
                  </p>
                </div>
              </Section>

              <Section className="bg-white/20 backdrop-blur-xl">
                <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl">
                  <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 1 }} className="space-y-6 text-left">
                    <h3 className="text-blue-600 font-black uppercase text-xs tracking-widest">Our Mission</h3>
                    <h4 className="text-5xl font-black text-slate-900 leading-tight">Clear Navigation Through Complex Testing</h4>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                      Every student's learning journey is fluid. Our mission is to guide you through the complexities of the digital SAT® with absolute clarity. We don't just teach you how to find the answer; we teach you how to think and adapt.
                    </p>
                  </motion.div>
                  <div className="h-[500px]">
                    <Canvas><ambientLight intensity={1.5}/><Suspense fallback={null}><AnimatedBrain /></Suspense></Canvas>
                  </div>
                </div>
              </Section>
              
              <Section>
                <div className="max-w-7xl w-full">
                  <h3 className="text-center font-black text-xs uppercase tracking-[0.4em] text-slate-400 mb-16">The Core Pillars</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { title: "Adaptive 3D Visualizations", desc: "We bring abstract math and data analysis to life through unique interactive models." },
                      { title: "True Algorithmic Precision", desc: "Our mock testing environments mirror the exact structure of the adaptive digital SAT®." },
                      { title: "Built for the Digital Era", desc: "Master the Desmos calculator and smart elimination strategies required on test day." }
                    ].map((pillar, i) => (
                      <div key={i} className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white shadow-2xl hover:bg-white transition-all">
                         <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6"><Layers size={24}/></div>
                         <h4 className="font-black text-xl mb-4">{pillar.title}</h4>
                         <p className="text-slate-500 text-sm font-bold leading-relaxed">{pillar.desc}</p>
                      </div>
                    ))}
                  </div>
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
                  <p className="opacity-70 text-lg font-medium leading-relaxed">Advanced algebraic modeling and non-linear systems synthesis.</p>
                </div>
                <div className="bg-white p-16 rounded-[4rem] text-slate-900 border border-slate-100 shadow-2xl">
                  <Award className="text-blue-600 mb-8" size={48} />
                  <h3 className="text-4xl font-black mb-6">Verbal Synthesis</h3>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">Structural transitions and complex inference mapping.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: PRICING */}
          {view === 'pricing' && (
            <motion.div 
              key="pricing" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
            >
              <Pricing />
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
                    <button onClick={() => handleNav('home')} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 mx-auto shadow-xl"><RotateCcw/> Return Home</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* LEGAL VIEWS */}
          {view === 'privacy' && (
            <LegalPage type="privacy" onBack={() => handleNav('home')} />
          )}
          {view === 'terms' && (
            <LegalPage type="terms" onBack={() => handleNav('home')} />
          )}
          {view === 'refund' && (
            <LegalPage type="refund" onBack={() => handleNav('home')} />
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 bg-white/60 backdrop-blur-md border-t border-slate-200 py-20 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6 font-black text-2xl tracking-tighter">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">Q</div>
                QuasarPrep
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-2"><Mail size={14}/> quasarprep@quasarprep.online</p>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-2"><Phone size={14}/> +91 7061014213</p>
              </div>
            </div>
            
            {/* Legal Navigation Links */}
            <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
               <button onClick={()=>handleNav('about')} className="text-left hover:text-blue-600 transition-colors">The Mission</button>
               <button onClick={()=>handleNav('pricing')} className="text-left hover:text-blue-600 transition-colors">Pricing</button>
               <button onClick={()=>handleNav('curriculum')} className="text-left hover:text-blue-600 transition-colors">Curriculum</button>
            </div>
            
            <div className="flex flex-col gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
               <button onClick={()=>handleNav('privacy')} className="text-left hover:text-blue-600 transition-colors flex items-center gap-2">
                 <Lock size={12} /> Privacy Policy
               </button>
               <button onClick={()=>handleNav('terms')} className="text-left hover:text-blue-600 transition-colors flex items-center gap-2">
                 <FileText size={12} /> Terms & Conditions
               </button>
               <button onClick={()=>handleNav('refund')} className="text-left hover:text-blue-600 transition-colors flex items-center gap-2">
                 <RefreshCcw size={12} /> Refund Policy
               </button>
               <span className="text-slate-300 mt-2">© 2026 QuasarPrep Academic</span>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest max-w-4xl leading-relaxed">
              Mandatory Disclaimer — SAT® is a registered trademark of the College Board, which is not affiliated with, and does not endorse, this website.
            </p>
            <div className="flex gap-4">
              <button onClick={()=>handleNav('privacy')} className="text-[10px] text-slate-400 uppercase font-black tracking-widest hover:text-blue-600">Privacy</button>
              <button onClick={()=>handleNav('terms')} className="text-[10px] text-slate-400 uppercase font-black tracking-widest hover:text-blue-600">Terms</button>
              <button onClick={()=>handleNav('refund')} className="text-[10px] text-slate-400 uppercase font-black tracking-widest hover:text-blue-600">Refunds</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
