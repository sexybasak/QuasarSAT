import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Send, 
  MessageCircle, 
  Mail, 
  Zap, 
  Award, 
  Target, 
  ShieldCheck, 
  Users, 
  Compass,
  Loader2,
  Lock,
  CreditCard
} from 'lucide-react';

// --- WHATSAPP FLOATING WIDGET (Bottom Left) ---
const WhatsAppWidget = () => (
  <motion.a
    href="https://wa.me/917061014213"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.1 }}
    className="fixed bottom-8 left-8 z-[999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
    title="Chat with QuasarPrep Support"
  >
    <MessageCircle size={32} fill="white" />
    <span className="absolute -top-1 -right-1 flex h-4 w-4">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
      <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
    </span>
    <span className="absolute left-16 bg-slate-900 text-white text-[10px] px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity font-black uppercase tracking-widest whitespace-nowrap pointer-events-none">
      WhatsApp Support
    </span>
  </motion.a>
);

// --- RAZORPAY PAYMENT COMPONENT ---
const RazorpayButton = ({ tier, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onError('Failed to load Razorpay. Please check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(tier.price) * 100, // Razorpay expects paise (INR)
          currency: 'INR',
          receipt: `receipt_${tier.id}_${Date.now()}`,
          notes: {
            planName: tier.name,
            planId: tier.id,
            studentEmail: tier.studentEmail || ''
          }
        })
      });

      if (!orderResponse.ok) throw new Error('Failed to create order');

      const orderData = await orderResponse.json();

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'QuasarPrep',
        description: `${tier.name} - SAT Preparation`,
        image: 'https://quasarprep.online/logo.png', // Your logo URL
        order_id: orderData.id,
        handler: function (response) {
          // Payment successful
          verifyPayment(response, tier);
        },
        prefill: {
          name: tier.studentName || '',
          email: tier.studentEmail || '',
          contact: tier.studentPhone || ''
        },
        notes: {
          planId: tier.id,
          planName: tier.name
        },
        theme: {
          color: '#2563eb' // Matches your blue theme
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      onError(error.message);
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse, tier) => {
    try {
      const verifyResponse = await fetch('/api/verify-razorpay-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          planId: tier.id,
          planName: tier.name
        })
      });

      const verifyData = await verifyResponse.json();
      
      if (verifyData.verified) {
        onSuccess({
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: paymentResponse.razorpay_order_id,
          plan: tier
        });
      } else {
        onError('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handlePayment}
      disabled={loading}
      className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${
        tier.highlight 
          ? 'bg-blue-600 text-white hover:bg-slate-900 shadow-xl shadow-blue-200' 
          : 'bg-slate-900 text-white hover:bg-blue-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Initializing...
        </>
      ) : (
        <>
          <Lock size={14} />
          {tier.button}
        </>
      )}
    </motion.button>
  );
};

const Pricing = () => {
  const [formStatus, setFormStatus] = useState('idle');
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const tiers = [
    {
      id: 'neural-baseline',
      name: "Neural Baseline",
      category: "Freemium",
      price: "0",
      priceInr: "0",
      description: "Ideal for self-driven scholars starting their 1500+ journey.",
      features: [
        "Full Socratic Engine Access",
        "DNA Profiler Diagnostic",
        "Basic Pattern Analytics",
        "Community Support Access"
      ],
      button: "Access Lab",
      highlight: false
    },
    {
      id: 'success-specialist',
      name: "Success Specialist",
      category: "Pro Tier",
      price: "50",
      priceInr: "4200", // ~$50 in INR
      description: "Advanced AI integration for targeted section mastery.",
      features: [
        "Everything in Freemium",
        "Real-time AI Neural Help",
        "1 Dedicated Section Tutor",
        "Bi-weekly Strategy Audits",
        "Advanced DNA Mapping"
      ],
      button: "Upgrade to Pro",
      highlight: true
    },
    {
      id: 'quasar-executive',
      name: "Quasar Executive",
      category: "Elite Tier",
      price: "150",
      priceInr: "12500", // ~$150 in INR
      description: "The gold standard for Ivy League admissions preparation.",
      features: [
        "Everything in Specialist",
        "3 Dedicated Tutors (Quant/Verbal)",
        "Dedicated Success Specialist (SSM)",
        "Free Career & College Counseling",
        "Unlimited Practice Proctors"
      ],
      button: "Go Executive",
      highlight: false
    }
  ];

  const handlePaymentSuccess = (data) => {
    setPaymentSuccess(data);
    setFormStatus('success');
    
    // Optional: Send to your backend for enrollment
    fetch('/api/enroll-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId: data.paymentId,
        orderId: data.orderId,
        planId: data.plan.id,
        planName: data.plan.name
      })
    }).catch(console.error);
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
    setTimeout(() => setPaymentError(null), 5000);
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 pb-20">
      <WhatsAppWidget />

      {/* Payment Success Modal */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
                <Check size={40} />
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-2">Neural Link Activated.</h3>
              <p className="text-slate-500 font-medium mb-6">
                Payment successful. Welcome to {paymentSuccess.plan.name}.
              </p>
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Payment ID</p>
                <p className="text-sm font-mono text-slate-700 break-all">{paymentSuccess.paymentId}</p>
              </div>
              <button 
                onClick={() => setPaymentSuccess(null)}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
              >
                Enter Neural Lab
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Error Toast */}
      <AnimatePresence>
        {paymentError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <span className="text-sm font-black">{paymentError}</span>
            <button onClick={() => setPaymentError(null)} className="text-white/80 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Neural Equity</span>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            Investment in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Intelligence.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto italic">
            Transparent pricing designed for the pursuit of a 1600. No hidden fees, just raw cognitive growth.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10 }}
            className={`relative p-10 rounded-[3rem] border ${
              tier.highlight 
                ? 'border-blue-600 bg-blue-50/30 shadow-2xl shadow-blue-200' 
                : 'border-slate-100 bg-white shadow-xl shadow-slate-200/50'
            } flex flex-col`}
          >
            {tier.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Most Effective
              </div>
            )}
            
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tier.category}</span>
              <h3 className="text-2xl font-black mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-5xl font-black">₹{tier.priceInr}</span>
                <span className="text-slate-400 text-sm font-bold">/mo</span>
              </div>
              {parseInt(tier.price) > 0 && (
                <p className="text-xs text-slate-400 font-medium mt-1">~${tier.price} USD</p>
              )}
            </div>

            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
              {tier.description}
            </p>

            <ul className="space-y-4 mb-12 flex-grow">
              {tier.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                  <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            {parseInt(tier.price) === 0 ? (
              <button className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
                {tier.button}
              </button>
            ) : (
              <RazorpayButton 
                tier={tier}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </motion.div>
        ))}
      </section>

      {/* Trust Badges */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={20} className="text-green-500" />
            <span className="text-xs font-black uppercase tracking-widest">Razorpay Secure</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <CreditCard size={20} className="text-blue-500" />
            <span className="text-xs font-black uppercase tracking-widest">UPI • Cards • NetBanking</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Lock size={20} className="text-slate-500" />
            <span className="text-xs font-black uppercase tracking-widest">256-bit SSL</span>
          </div>
        </div>
      </section>

      {/* Enrollment Form Section */}
      <section className="max-w-4xl mx-auto px-6 mt-32">
        <div className="bg-slate-50 p-10 md:p-20 rounded-[4rem] border border-slate-100 shadow-inner">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight mb-4 text-slate-900">Request Strategic Enrollment</h2>
            <p className="text-slate-500 font-medium">Complete your neural profile. A Success Specialist will review your data within 24 hours.</p>
          </div>

          {formStatus === 'success' ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-10"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-green-100">
                <Check size={40} />
              </div>
              <h3 className="text-2xl font-black">Transmission Received.</h3>
              <p className="text-slate-500 font-bold">Check your email at <span className="text-blue-600">quasarprep@quasarprep.online</span> for the next steps.</p>
            </motion.div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); setFormStatus('success'); }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Student Name</label>
                <input required type="text" placeholder="e.g. Alex Chen" className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Contact</label>
                <input required type="email" placeholder="student@example.com" className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">WhatsApp Number</label>
                <input required type="tel" placeholder="+91 00000 00000" className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Target Score</label>
                <select className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold appearance-none">
                  <option>1500 - 1530</option>
                  <option>1540 - 1570</option>
                  <option>1580 - 1600</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Current Mock Score & Pain Points</label>
                <textarea rows="4" placeholder="Briefly describe your current blockers..." className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 transition-all font-bold"></textarea>
              </div>
              <button className="md:col-span-2 w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl">
                Submit Enrollment Request <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="mt-20 text-center px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-blue-600" />
            <span className="text-sm font-black text-slate-400">quasarprep@quasarprep.online</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-green-500" />
            <span className="text-sm font-black text-slate-400">+91 7061014213</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] italic">
          SAT® is a registered trademark of the College Board. QuasarPrep is an independent educational laboratory.
        </p>
      </footer>
    </div>
  );
};

export default Pricing;
