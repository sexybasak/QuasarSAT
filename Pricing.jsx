import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Send, MessageCircle, Mail, Zap, 
  Award, Target, ShieldCheck, Users, Compass,
  Loader2, Lock, CreditCard, RefreshCw
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
    const interval = setInterval(fetchRate, 3600000); // Refresh hourly
    return () => clearInterval(interval);
  }, []);

  return { rate, loading, lastUpdated, refresh: fetchRate };
};

// --- RAZORPAY BUTTON WITH LIVE PRICING ---
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
      const inrAmount = Math.round(tier.usdPrice * rate * 100); // paise

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
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          usdPrice: tier.usdPrice,
          exchangeRate: rate
        },
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

// --- MAIN PRICING COMPONENT ---
const Pricing = () => {
  const { rate, loading: rateLoading, lastUpdated, refresh } = useExchangeRate();
  const [formStatus, setFormStatus] = useState('idle');
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const basePrices = { specialist: 50, executive: 150 };

  const tiers = [
    {
      id: 'neural-baseline',
      name: "Neural Baseline",
      category: "Freemium",
      usdPrice: 0,
      description: "Ideal for self-driven scholars starting their 1500+ journey.",
      features: ["Full Socratic Engine Access", "DNA Profiler Diagnostic", "Basic Pattern Analytics", "Community Support Access"],
      button: "Access Lab",
      highlight: false
    },
    {
      id: 'success-specialist',
      name: "Success Specialist",
      category: "Pro Tier",
      usdPrice: basePrices.specialist,
      description: "Advanced AI integration for targeted section mastery.",
      features: ["Everything in Freemium", "Real-time AI Neural Help", "1 Dedicated Section Tutor", "Bi-weekly Strategy Audits", "Advanced DNA Mapping"],
      button: "Upgrade to Pro",
      highlight: true
    },
    {
      id: 'quasar-executive',
      name: "Quasar Executive",
      category: "Elite Tier",
      usdPrice: basePrices.executive,
      description: "The gold standard for Ivy League admissions preparation.",
      features: ["Everything in Specialist", "3 Dedicated Tutors", "Dedicated SSM", "Career Counseling", "Unlimited Proctors"],
      button: "Go Executive",
      highlight: false
    }
  ];

  const handlePaymentSuccess = (data) => {
    setPaymentSuccess(data);
    setFormStatus('success');
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 pb-20">
      {/* WhatsApp Widget */}
      <motion.a href="https://wa.me/917061014213" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-[999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center">
        <MessageCircle size={32} fill="white" />
      </motion.a>

      {/* Success/Error Modals */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <Check size={40} />
              </div>
              <h3 className="text-3xl font-black mb-2">Payment Successful</h3>
              <p className="text-slate-500 mb-4">Paid ₹{paymentSuccess.inrPaid?.toLocaleString('en-IN')} for ${paymentSuccess.usdPrice} plan</p>
              <p className="text-xs text-slate-400 mb-6">Exchange rate applied at time of payment</p>
              <button onClick={() => setPaymentSuccess(null)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest">
                Enter Neural Lab
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Neural Equity</span>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            Investment in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Intelligence.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto italic">
            Prices in USD. Charged in INR at live exchange rates.
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
          <motion.div key={i} whileHover={{ y: -10 }} 
            className={`relative p-10 rounded-[3rem] border ${tier.highlight ? 'border-blue-600 bg-blue-50/30 shadow-2xl shadow-blue-200' : 'border-slate-100 bg-white shadow-xl'} flex flex-col`}>
            
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

            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{tier.description}</p>

            <ul className="space-y-4 mb-12 flex-grow">
              {tier.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                  <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            {tier.usdPrice === 0 ? (
              <button className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
                {tier.button}
              </button>
            ) : (
              <RazorpayButton 
                tier={tier} 
                rate={rate}
                onSuccess={handlePaymentSuccess} 
                onError={setPaymentError} 
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
            <span className="text-xs font-black uppercase tracking-widest">Live FX Rates</span>
          </div>
        </div>
      </section>

      {/* Enrollment Form */}
      <section className="max-w-4xl mx-auto px-6 mt-32">
        <div className="bg-slate-50 p-10 md:p-20 rounded-[4rem] border border-slate-100 shadow-inner">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black tracking-tight mb-4">Request Strategic Enrollment</h2>
            <p className="text-slate-500 font-medium">A Success Specialist will review your data within 24 hours.</p>
          </div>
          {/* ... form content same as before ... */}
        </div>
      </section>

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
      </footer>
    </div>
  );
};

export default Pricing;
