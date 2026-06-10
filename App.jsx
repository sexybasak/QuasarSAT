import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  Brain, Target, Award, ArrowRight, Lightbulb, BookOpen, 
  ChevronRight, CheckCircle2, RotateCcw, Zap, Shield, 
  Mail, MapPin, Layers, Cpu, Info, Search, MessageCircle, Phone,
  FileText, Lock, ShieldCheck, RefreshCcw, ArrowLeft, ExternalLink,
  Sparkles, Waves, Droplets, Wind, Atom, Orbit, Eye, MousePointer2
} from 'lucide-react';

// EXTERNAL COMPONENT
import Pricing from './Pricing'; 

// MATH & 3D RENDERING
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, OrbitControls, Environment, ContactShadows, MeshTransmissionMaterial, Text3D, Center, Float as DreiFloat } from '@react-three/drei';
import * as THREE from 'three';

// DATA IMPORT
import { QUIZ_DATA } from './questions.js';

// --- ENHANCED FLUID BACKGROUND SYSTEM ---
const FluidBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let animationId;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 200 + 100;
        this.hue = Math.random() > 0.5 ? 210 : 190; // Blue to cyan range
        this.life = Math.random() * 100;
        this.maxLife = 100 + Math.random() * 100;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Mouse interaction - gentle repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          const force = (300 - dist) / 300;
          this.vx += (dx / dist) * force * 0.02;
          this.vy += (dy / dist) * force * 0.02;
        }

        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Wrap around
        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;

        // Reset life
        if (this.life > this.maxLife) {
          this.life = 0;
          this.radius = Math.random() * 200 + 100;
        }
      }

      draw() {
        const opacity = Math.sin((this.life / this.maxLife) * Math.PI) * 0.15;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 50%, ${opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 60%, 40%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      for (let i = 0; i < 15; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(240, 249, 255, 0.1)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Connect nearby particles with flowing lines
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400) {
            ctx.strokeStyle = `hsla(200, 70%, 50%, ${0.03 * (1 - dist / 400)})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            // Curved connection
            ctx.quadraticCurveTo(
              (p1.x + p2.x) / 2 + Math.sin(p1.life * 0.01) * 50,
              (p1.y + p2.y) / 2 + Math.cos(p1.life * 0.01) * 50,
              p2.x, p2.y
            );
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    init();
    animate();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0"
      style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)' }}
    />
  );
};

// --- CINEMATIC 3D SCENE COMPONENTS ---
function NeuralCore() {
  const meshRef = useRef();
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
    
    groupRef.current.rotation.z = t * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 20]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.03}
            anisotropy={0.5}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color="#2563eb"
            attenuationColor="#1e40af"
            attenuationDistance={0.5}
          />
        </mesh>
      </Float>
      
      {/* Orbiting particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <OrbitingParticle key={i} index={i} total={8} />
      ))}
      
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function OrbitingParticle({ index, total }) {
  const ref = useRef();
  const angle = (index / total) * Math.PI * 2;
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const radius = 2 + Math.sin(t * 0.3 + index) * 0.3;
    ref.current.position.x = Math.cos(angle + t * 0.2) * radius;
    ref.current.position.y = Math.sin(angle + t * 0.2) * radius * 0.5;
    ref.current.position.z = Math.sin(angle + t * 0.2) * radius;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#60a5fa" />
      <pointLight intensity={0.5} distance={2} color="#60a5fa" />
    </mesh>
  );
}

function FloatingNumbers() {
  const numbers = ['1550', 'x²', '∑', 'π', '√', 'Δ', '∞', '∫'];
  
  return numbers.map((num, i) => (
    <FloatingMath key={i} text={num} index={i} total={numbers.length} />
  ));
}

function FloatingMath({ text, index, total }) {
  const ref = useRef();
  const angle = (index / total) * Math.PI * 2;
  const height = 3 + Math.random() * 2;
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.x = Math.cos(angle + t * 0.1) * 4;
    ref.current.position.y = Math.sin(t * 0.5 + index) * 0.5 + height;
    ref.current.position.z = Math.sin(angle + t * 0.1) * 4;
    ref.current.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={ref}>
      <textGeometry args={[text, { size: 0.3, height: 0.05 }]} />
      <meshBasicMaterial color="#93c5fd" transparent opacity={0.4} />
    </mesh>
  );
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#60a5fa" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3b82f6" />
      <NeuralCore />
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0.5} fade speed={1} />
      <Environment preset="city" />
    </>
  );
}

// --- PARALLAX WRAPPER ---
const ParallaxSection = ({ children, speed = 0.5, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div ref={ref} style={{ y, opacity, scale }} className={className}>
      {children}
    </motion.div>
  );
};

// --- MAGNETIC INTERACTION WRAPPER (Enhanced) ---
const MagneticButton = ({ children, onClick, className, strength = 0.35 }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const move = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const newX = (clientX - (left + width / 2)) * strength;
    const newY = (clientY - (top + height / 2)) * strength;
    x.set(newX);
    y.set(newY);
    setPos({ x: newX, y: newY });
  };

  const leave = () => {
    x.set(0);
    y.set(0);
    setPos({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// --- CURSOR FOLLOWER ---
const CursorFollower = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-blue-500/50 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    />
  );
};

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

// --- LEGAL PAGE COMPONENT (Cinematic) ---
const LegalPage = ({ type, onBack }) => {
  const content = LEGAL_CONTENT[type];
  const Icon = content.icon;
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div 
      key={type}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6 relative"
    >
      {/* Reading progress bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-[200]"
        style={{ width: progressWidth }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={onBack}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase tracking-widest mb-8 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} />
          Return to Site
        </motion.button>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/50 shadow-2xl p-12 md:p-16 mb-10 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex items-center gap-4 mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl"
            >
              <Icon size={32} />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                {content.title}
              </h1>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">
                Last Updated: {content.lastUpdated}
              </p>
            </div>
          </div>
          <p className="text-slate-600 font-medium leading-relaxed relative z-10">
            Please read these {content.title.toLowerCase()} carefully before using QuasarPrep services. 
            By accessing our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
          </p>
        </motion.div>

        <div className="space-y-6">
          {content.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 10 }}
              className="bg-white/30 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-xl p-10 md:p-12 hover:bg-white/50 transition-all cursor-default group"
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 font-black text-sm shrink-0 mt-1 group-hover:bg-blue-600 group-hover:text-white transition-all"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </motion.div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
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

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white mb-4">Questions About Our Policies?</h3>
            <p className="text-slate-400 font-medium mb-8 max-w-lg mx-auto">
              Our academic support team is available to clarify any concerns regarding your privacy, rights, or refunds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="mailto:quasarprep@quasarprep.online" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-colors"
              >
                <Mail size={16} />
                Email Support
              </motion.a>
              <motion.a 
                href="https://wa.me/917061014213" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </motion.a>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 text-center"
        >
          <button 
            onClick={onBack}
            className="text-slate-400 text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            ← Back to QuasarPrep Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- THE QUIZ LOGIC (Enhanced) ---
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

  if (!questions.length) return (
    <div className="pt-40 text-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
      />
      <div className="font-black text-blue-600 tracking-widest uppercase">Initializing Neural Paths...</div>
    </div>
  );

  const q = questions[idx];
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10">
      <motion.div 
        key={idx}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-8 bg-white/40 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/50 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-black text-blue-600 tracking-widest uppercase">Diagnostic Assessment {idx + 1}/10</div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i < idx ? 'bg-blue-600' : i === idx ? 'bg-blue-400 animate-pulse' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-8 p-8 bg-slate-900 text-white rounded-[2rem] text-xl leading-relaxed shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[50px]" />
          <div className="relative z-10">{format(q.question_text)}</div>
        </div>
        
        <div className="grid gap-4">
          {Object.entries(q.choices).map(([key, val]) => (
            <motion.button 
              key={key} 
              onClick={() => !revealed && setSelected(key)}
              whileHover={!revealed ? { scale: 1.02, x: 5 } : {}}
              whileTap={!revealed ? { scale: 0.98 } : {}}
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5
                ${selected === key ? 'border-blue-600 bg-blue-50/80' : 'border-white/50 bg-white/30 hover:bg-white/60'}
                ${revealed && key === q.correct_answer ? 'border-green-500 bg-green-50/80' : ''}
                ${revealed && selected === key && key !== q.correct_answer ? 'border-red-400 bg-red-50/80' : ''}
              `}
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${selected === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{key}</span>
              <span className="font-bold text-slate-800 text-lg">{format(val)}</span>
            </motion.button>
          ))}
        </div>
        
        <motion.button 
          onClick={() => {
            if (!revealed) { if (selected === q.correct_answer) setScore(s => s + 1); setRevealed(true); }
            else if (idx < 9) { setIdx(i => i + 1); setSelected(null); setRevealed(false); }
            else onFinish(score);
          }}
          disabled={!selected}
          whileHover={selected ? { scale: 1.02 } : {}}
          whileTap={selected ? { scale: 0.98 } : {}}
          className="w-full mt-10 py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl"
        >
          {revealed ? (idx < 9 ? "Next Challenge →" : "Complete Assessment") : "Validate Selection"}
        </motion.button>
      </motion.div>
      
      <div className="lg:col-span-4 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 shadow-xl"
        >
           <div className="flex items-center gap-2 font-black text-[10px] text-blue-600 mb-4 uppercase tracking-widest">
             <Lightbulb size={16} className="animate-pulse"/> 
             Socratic Clue
           </div>
           <p className="text-slate-600 font-medium italic leading-relaxed">{format(q.socraticHint)}</p>
        </motion.div>
        
        <AnimatePresence>
          {revealed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <div className="font-black text-[10px] uppercase mb-3 tracking-widest text-blue-200">The Logical Proof</div>
                <p className="text-sm leading-relaxed font-bold">{format(q.reasoning)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- HERO SECTION (Cinematic) ---
const CinematicHero = ({ onNavigate }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl w-full relative z-10 px-6">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ y: y2 }}
          className="text-left"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4 underline decoration-4 underline-offset-8"
          >
            1550+ Cognitive Map
          </motion.div>
          
          <h1 className="text-7xl md:text-[100px] font-black tracking-tighter leading-[0.85] mb-8">
            Neural <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">SAT</span> Logic.
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-xl text-slate-500 font-bold max-w-md mb-12 italic leading-relaxed"
          >
            Deconstruct the Digital SAT® using advanced pattern synthesis and neural adaptive learning.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex gap-4"
          >
            <MagneticButton 
              onClick={() => onNavigate('diagnostic')} 
              className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:shadow-blue-500/50 transition-shadow"
            >
              Enter Neural Lab
            </MagneticButton>
            <motion.button 
              onClick={() => onNavigate('about')}
              whileHover={{ scale: 1.05 }}
              className="bg-white/40 backdrop-blur-xl text-slate-900 px-8 py-6 rounded-[2rem] font-black uppercase tracking-widest border border-white/50"
            >
              Explore
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="h-[600px] w-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f0f9ff]/50 z-10 pointer-events-none" />
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
          </Canvas>
          
          {/* Floating UI elements around 3D scene */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-lg"
          >
            <div className="text-xs font-black text-blue-600 uppercase tracking-widest">Active Neurons</div>
            <div className="text-2xl font-black text-slate-900">2.4M</div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 left-0 bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-lg"
          >
            <div className="text-xs font-black text-blue-600 uppercase tracking-widest">Pattern Recognition</div>
            <div className="text-2xl font-black text-slate-900">98.7%</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Scroll to Explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight size={20} className="text-slate-400 rotate-90" />
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- 6. MAIN APPLICATION (Cinematic) ---
export default function App() {
  const [view, setView] = useState('home');
  const [finalScore, setFinalScore] = useState(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleNav = (newView) => {
    setView(newView);
    setFinalScore(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-900 overflow-x-hidden">
      <FluidBackground />
      <CursorFollower />
      
      {/* Progress bar for all pages */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[200]"
        style={{ scaleX }}
      />
      
      {/* WHATSAPP WIDGET */}
      <motion.a 
        href="https://wa.me/917061014213" 
        target="_blank" 
        rel="noopener noreferrer"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        className="fixed bottom-8 left-8 z-[200] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
      >
        <MessageCircle size={32} fill="white" />
      </motion.a>

      {/* NAVIGATION BAR */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-5xl"
      >
        <nav className="bg-white/30 backdrop-blur-3xl border border-white/50 shadow-2xl rounded-full h-20 flex items-center justify-between px-10">
          <motion.div 
            onClick={() => handleNav('home')} 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-xl"
            >
              Q
            </motion.div>
            <span className="font-black tracking-tighter text-2xl">QuasarPrep</span>
          </motion.div>
          
          <div className="hidden md:flex gap-10 items-center">
            {['home', 'about', 'curriculum', 'pricing'].map((item) => (
              <motion.button 
                key={item}
                onClick={() => handleNav(item)}
                whileHover={{ y: -2 }}
                className={`text-[11px] font-black uppercase tracking-widest transition-colors ${view === item ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              >
                {item === 'home' ? 'Strategy' : item}
              </motion.button>
            ))}
            <MagneticButton 
              onClick={() => handleNav('diagnostic')} 
              className="bg-slate-900 text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
            >
              Diagnostic
            </MagneticButton>
          </div>
        </nav>
      </motion.header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME */}
          {view === 'home' && (
            <motion.div 
              key="home" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="relative"
            >
              <CinematicHero onNavigate={handleNav} />
              
              {/* Features Section with Parallax */}
              <ParallaxSection speed={0.3} className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4"
                    >
                      The Neural Network
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">
                      Beyond Traditional <span className="text-blue-600">Prep.</span>
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { icon: Brain, title: "Cognitive Mapping", desc: "AI-driven analysis of your thinking patterns to identify and strengthen weak neural pathways." },
                      { icon: Zap, title: "Adaptive Velocity", desc: "Real-time difficulty adjustment that mirrors the Digital SAT's multistage adaptive testing." },
                      { icon: Target, title: "Precision Strikes", desc: "Laser-focused practice on high-yield concepts that appear in 80% of test administrations." }
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/50 shadow-2xl hover:shadow-blue-500/20 transition-all group"
                      >
                        <motion.div 
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg"
                        >
                          <feature.icon size={28} />
                        </motion.div>
                        <h3 className="font-black text-2xl mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ParallaxSection>

              {/* Stats Section */}
              <ParallaxSection speed={-0.2} className="py-32 px-6 bg-slate-900/5">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { value: "2,400+", label: "Neural Patterns" },
                    { value: "98%", label: "Accuracy Rate" },
                    { value: "1560", label: "Top Score Achieved" },
                    { value: "50K+", label: "Students Mapped" }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                      className="text-center"
                    >
                      <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">{stat.value}</div>
                      <div className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </ParallaxSection>
            </motion.div>
          )}

          {/* VIEW: ABOUT */}
          {view === 'about' && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32">
              <div className="max-w-4xl mx-auto px-6 text-center mb-32">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-10 text-slate-900"
                >
                  Master the SAT®. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Navigate Your Future.</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl text-slate-600 font-bold leading-relaxed max-w-3xl mx-auto"
                >
                  At QuasarPrep, we believe that preparing for the SAT® shouldn't feel like staring at static paper or memorizing rigid rules. The digital SAT® is dynamic, adaptive, and precise—and your prep platform should be too.
                </motion.p>
              </div>

              <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto px-6 mb-32">
                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="space-y-6 text-left"
                >
                  <h3 className="text-blue-600 font-black uppercase text-xs tracking-widest">Our Mission</h3>
                  <h4 className="text-5xl font-black text-slate-900 leading-tight">Clear Navigation Through Complex Testing</h4>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                    Every student's learning journey is fluid. Our mission is to guide you through the complexities of the digital SAT® with absolute clarity. We don't just teach you how to find the answer; we teach you how to think and adapt.
                  </p>
                </motion.div>
                <div className="h-[500px]">
                  <Canvas>
                    <Suspense fallback={null}>
                      <Scene3D />
                    </Suspense>
                  </Canvas>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto px-6 pb-32">
                <h3 className="text-center font-black text-xs uppercase tracking-[0.4em] text-slate-400 mb-16">The Core Pillars</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { title: "Adaptive 3D Visualizations", desc: "We bring abstract math and data analysis to life through unique interactive models." },
                    { title: "True Algorithmic Precision", desc: "Our mock testing environments mirror the exact structure of the adaptive digital SAT®." },
                    { title: "Built for the Digital Era", desc: "Master the Desmos calculator and smart elimination strategies required on test day." }
                  ].map((pillar, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      whileHover={{ y: -5 }}
                      className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/50 shadow-2xl hover:bg-white/60 transition-all"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6"><Layers size={24}/></div>
                      <h4 className="font-black text-xl mb-4">{pillar.title}</h4>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed">{pillar.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: CURRICULUM */}
          {view === 'curriculum' && (
            <motion.div key="curr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-40 max-w-6xl mx-auto px-6 text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl font-black tracking-tighter mb-20 text-slate-900"
              >
                Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Modules.</span>
              </motion.h2>
              <div className="grid md:grid-cols-2 gap-12 text-left">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-900 p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] group-hover:bg-blue-600/30 transition-all" />
                  <div className="relative z-10">
                    <Target className="text-blue-400 mb-8" size={48} />
                    <h3 className="text-4xl font-black mb-6 text-blue-400">Quant Vector</h3>
                    <p className="opacity-70 text-lg font-medium leading-relaxed">Advanced algebraic modeling and non-linear systems synthesis.</p>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/60 backdrop-blur-xl p-16 rounded-[4rem] text-slate-900 border border-white/50 shadow-2xl"
                >
                  <Award className="text-blue-600 mb-8" size={48} />
                  <h3 className="text-4xl font-black mb-6">Verbal Synthesis</h3>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">Structural transitions and complex inference mapping.</p>
                </motion.div>
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
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl mx-auto py-20 text-center px-6"
                >
                  <div className="bg-white/40 backdrop-blur-2xl p-20 rounded-[5rem] shadow-2xl border border-white/50">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <Award size={100} className="text-blue-600 mx-auto mb-8" />
                    </motion.div>
                    <h2 className="text-4xl font-black text-slate-400 uppercase tracking-widest mb-4">Neural Calibrated Score</h2>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 leading-none mb-10 tracking-tighter"
                    >
                      {Math.round((finalScore / 10) * 800 + 800)}
                    </motion.div>
                    <motion.button 
                      onClick={() => handleNav('home')} 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 mx-auto shadow-xl hover:bg-blue-600 transition-colors"
                    >
                      <RotateCcw/> Return Home
                    </motion.button>
                  </div>
                </motion.div>
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
      <footer className="relative z-10 bg-white/40 backdrop-blur-md border-t border-white/50 py-20 px-10">
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
          
          <div className="border-t border-white/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
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
