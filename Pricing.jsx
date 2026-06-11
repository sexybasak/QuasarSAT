import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Send, MessageCircle, Mail, Zap, 
  Award, Target, ShieldCheck, Users, Compass,
  Loader2, Lock, CreditCard, RefreshCw, Phone,
  User, BookOpen, TrendingUp, AlertCircle
} from 'lucide-react';

// --- EXCHANGE RATE HOOK ---
const useExchangeRate = () => {
  const [rate, setRate] = useState(83.5);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRate = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setRate(data.rates.INR);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.log('Rate fetch failed, using fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, 3600000);
    return () => clearInterval(interval);
  }, []);

  return { rate, loading, lastUpdated, refresh: fetchRate };
};

// --- RAZORPAY BUTTON ---
const RazorpayButton = ({ tier, rate, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
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
      onError('Failed to load Razorpay');
      setLoading(false);
      return;
    }

    try {
      const inrAmount = Math.round(tier.usdPrice * rate * 100);

      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: inrAmount,
          currency: 'INR',
          receipt: `receipt_${tier.id}_${Date.now()}`,
          notes: {
            planName: tier.name,
            planId: tier.id,
            usdPrice: tier.usdPrice,
            exchangeRate: rate
          }
        })
      });

      if (!orderResponse.ok) throw new Error('Order creation failed');
      const orderData = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'QuasarPrep',
        description: `${tier.name} - $${tier.usdPrice} USD`,
        image: 'https://quasarprep.online/logo.png',
        order_id: orderData.id,
        handler: (response) => verifyPayment(response, tier, rate),
        prefill: { name: '', email: '', contact: '' },
        notes: { usdPrice: tier.usdPrice, exchangeRate: rate },
        theme: { color: '#2563eb' }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      onError(error.message);
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse, tier, currentRate) => {
    try {
      const verifyResponse = await fetch('/api/verify-razorpay-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          planId: tier.id,
          usdPrice: tier.usdPrice,
          exchangeRate: currentRate
        })
      });

      const verifyData = await verifyResponse.json();
      if (verifyData.verified) {
        onSuccess({
          paymentId: paymentResponse.razorpay_payment_id,
          usdPrice: tier.usdPrice,
          inrPaid: Math.round(tier.usdPrice * currentRate)
        });
      } else {
        onError('Verification failed');
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
      } disabled:opacity-50`}
    >
      {loading ? (
        <><Loader2 size={16} className="animate-spin" /> Processing...</>
      ) : (
        <><Lock size={14} /> Pay ₹{Math.round(tier.usdPrice * rate).toLocaleString('en-IN')}</>
      )}
    </motion.button>
  );
};

// --- WHATSAPP WIDGET ---
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

const Pricing = () => {
  const { rate, loading: rateLoading, lastUpdated, refresh } = useExchangeRate();
  const [formStatus, setFormStatus] = useState('idle'); // idle | submitting | success | error
  const [formError, setFormError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    targetScore: '1500 - 1530',
    currentScore: '',
    painPoints: '',
    preferredPlan: ''
  });

  const basePrices = { specialist: 50, executive: 150 };

  const tiers = [
    {
      id: 'neural-baseline',
      name: "Neural Baseline",
      category: "Freemium",
      usdPrice: 0,
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
      usdPrice: basePrices.specialist,
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
      usdPrice: basePrices.executive,
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

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormError('');

    try {
      const response = await fetch('/api/enroll-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'pricing_page'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Enrollment failed');
      }

      setFormStatus('success');
      setFormData({
        name: '', email: '', phone: '', targetScore: '1500 - 1530',
        currentScore: '', painPoints: '', preferredPlan: ''
      });
    } catch (error) {
      setFormStatus('error');
      setFormError(error.message);
    }
  };

  const handlePaymentSuccess = (data) => {
    setPaymentSuccess(data);
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
    setTimeout(() => setPaymentError(null), 5000);
  };

  const selectPlan = (planId) => {
    setFormData(prev => ({ ...prev, preferredPlan: planId }));
    // Scroll to form
    document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' });
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
                Payment successful. Welcome to QuasarPrep.
              </p>
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Payment ID</p>
                <p className="text-sm font-mono text-slate-700 break-all">{paymentSuccess.paymentId}</p>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 mt-3">Amount Paid</p>
                <p className="text-sm font-black text-slate-700">₹{paymentSuccess.inrPaid?.toLocaleString('en-IN')}</p>
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
            <AlertCircle size={18} />
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
          
          {/* Live Rate Indicator */}
          <div className="mt-6 inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
              1 USD = ₹{rate.toFixed(2)} INR
            </span>
            {rateLoading ? (
              <RefreshCw size={12} className="animate-spin text-blue-600" />
            ) : (
              <button onClick={refresh} className="text-slate-400 hover:text-blue-600">
                <RefreshCw size={12} />
              </button>
            )}
            {lastUpdated && (
              <span className="text-[10px] text-slate-400">Updated {lastUpdated}</span>
            )}
          </div>
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
                <span className="text-5xl font-black">${tier.usdPrice}</span>
                <span className="text-slate-400 text-sm font-bold">USD</span>
              </div>
              {tier.usdPrice > 0 && (
                <p className="text-sm text-slate-500 font-medium mt-2">
                  ≈ ₹{Math.round(tier.usdPrice * rate).toLocaleString('en-IN')} INR
                  {rateLoading && <span className="text-amber-500 ml-1 text-xs">(calculating...)</span>}
                </p>
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

            {tier.usdPrice === 0 ? (
              <button 
                onClick={() => selectPlan(tier.id)}
                className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
              >
                {tier.button}
              </button>
            ) : (
              <>
                <RazorpayButton 
                  tier={tier}
                  rate={rate}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
                <button 
                  onClick={() => selectPlan(tier.id)}
                  className="w-full mt-3 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-white border border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  Or Enroll via Form
                </button>
              </>
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
            <span className="text-xs font-black uppercase tracking-widest">Live FX Rates</span>
          </div>
        </div>
      </section>

      {/* Enrollment Form Section */}
      <section id="enrollment-form" className="max-w-4xl mx-auto px-6 mt-32">
        <div className="bg-slate-50 p-10 md:p-20 rounded-[4rem] border border-slate-100 shadow-inner">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight mb-4 text-slate-900">Request Strategic Enrollment</h2>
            <p className="text-slate-500 font-medium">Complete your neural profile. A Success Specialist will review your data within 24 hours.</p>
            {formData.preferredPlan && (
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                  Selected: {tiers.find(t => t.id === formData.preferredPlan)?.name}
                </span>
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, preferredPlan: '' }))}
                  className="text-blue-400 hover:text-blue-600"
                >
                  ✕
                </button>
              </div>
            )}
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
              <p className="text-slate-500 font-bold mt-2">
                Welcome email sent to <span className="text-blue-600">{formData.email}</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Check your inbox (and WhatsApp) for next steps from your SSM.
              </p>
              <button 
                onClick={() => setFormStatus('idle')}
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all"
              >
                Submit Another
              </button>
            </motion.div>
          ) : (
            <form 
              onSubmit={handleFormSubmit}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-1">
                  <User size={12} /> Student Name
                </label>
                <input 
                  required 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Alex Chen" 
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-1">
                  <Mail size={12} /> Email Contact
                </label>
                <input 
                  required 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="student@example.com" 
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-1">
                  <Phone size={12} /> WhatsApp Number
                </label>
                <input 
                  required 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="+91 00000 00000" 
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-1">
                  <TrendingUp size={12} /> Target Score
                </label>
                <select 
                  name="targetScore"
                  value={formData.targetScore}
                  onChange={handleFormChange}
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold appearance-none"
                >
                  <option>1500 - 1530</option>
                  <option>1540 - 1570</option>
                  <option>1580 - 1600</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-1">
                  <BookOpen size={12} /> Current Mock Score
                </label>
                <input 
                  type="text" 
                  name="currentScore"
                  value={formData.currentScore}
                  onChange={handleFormChange}
                  placeholder="e.g. 1280" 
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-1">
                  <Zap size={12} /> Preferred Plan
                </label>
                <select 
                  name="preferredPlan"
                  value={formData.preferredPlan}
                  onChange={handleFormChange}
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold appearance-none"
                >
                  <option value="">Select a plan...</option>
                  {tiers.map(tier => (
                    <option key={tier.id} value={tier.id}>{tier.name} - ${tier.usdPrice}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-1">
                  <Compass size={12} /> Current Mock Score & Pain Points
                </label>
                <textarea 
                  name="painPoints"
                  value={formData.painPoints}
                  onChange={handleFormChange}
                  rows="4" 
                  placeholder="Briefly describe your current blockers, weak sections, and target timeline..." 
                  className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 transition-all font-bold"
                ></textarea>
              </div>

              {formStatus === 'error' && (
                <div className="md:col-span-2 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-500 shrink-0" />
                  <p className="text-sm font-bold text-red-600">{formError}</p>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={formStatus === 'submitting'}
                className="md:col-span-2 w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
              >
                {formStatus === 'submitting' ? (
                  <><Loader2 size={18} className="animate-spin" /> Transmitting...</>
                ) : (
                  <><Send size={18} /> Submit Enrollment Request</>
                )}
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
