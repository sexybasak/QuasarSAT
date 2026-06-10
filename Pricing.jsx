import React from 'react';
import { motion } from 'framer-motion';
import { Check, Send, Mail, MessageCircle } from 'lucide-react';

export default function Pricing() {
  const plans = [
    { name: "Freemium", price: "$0", desc: "Socratic Engine Access", color: "bg-white/5" },
    { name: "Specialist", price: "$50", desc: "AI Help + 1 Dedicated Tutor", color: "bg-blue-600/20", border: "border-blue-500", highlight: true },
    { name: "Executive", price: "$150", desc: "All features + 3 Tutors + SSM", color: "bg-white/10" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-20">
      <div className="grid lg:grid-cols-3 gap-8 mb-24">
        {plans.map((p, i) => (
          <motion.div 
            whileHover={{ y: -10 }} key={i}
            className={`${p.color} backdrop-blur-3xl p-12 rounded-[4rem] border ${p.border || 'border-white/10'} shadow-2xl relative flex flex-col`}
          >
            {p.highlight && <div className="absolute top-8 right-8 bg-blue-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">Most Effective</div>}
            <h3 className="text-2xl font-black mb-2 uppercase">{p.name}</h3>
            <div className="text-6xl font-black mb-8">{p.price}<span className="text-sm opacity-40">/mo</span></div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-2 text-sm font-bold"><Check size={16} className="text-blue-400"/> {p.desc}</li>
            </ul>
            <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs">Access Plan</button>
          </motion.div>
        ))}
      </div>

      {/* CONTACT FORM */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-16 rounded-[5rem] max-w-3xl mx-auto">
        <h3 className="text-4xl font-black text-center mb-4 tracking-tighter">Establish Neural Link</h3>
        <p className="text-center text-slate-400 font-bold mb-12 italic">A Success Specialist (SSM) will contact you shortly.</p>
        <form className="grid md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Full Name" className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" />
          <input type="email" placeholder="quasarprep@quasarprep.online" className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500" />
          <input type="tel" placeholder="+91 7061014213" className="bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 md:col-span-2" />
          <button className="bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl md:col-span-2 flex items-center justify-center gap-3">
            Initialize Enrollment <Send size={18}/>
          </button>
        </form>
      </div>
    </div>
  );
}
