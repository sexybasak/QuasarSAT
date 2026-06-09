// pages/Home.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Brain3D from '../components/Brain3D';

const Section = ({ children, className }) => (
  <section className={`h-screen w-full flex flex-col items-center justify-center snap-start px-6 ${className}`}>
    {children}
  </section>
);

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      <Section>
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl w-full">
          <div className="text-left">
            <h1 className="text-8xl font-black tracking-tighter leading-[0.9] mb-6">
              Neural <br /><span className="text-blue-600">SAT</span> Logic.
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-md mb-8">
              Targeting the 1500+ ceiling using 3D cognitive mapping and socratic feedback.
            </p>
            <button className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl">Enter the Lab</button>
          </div>
          <Brain3D />
        </div>
      </Section>

      <Section className="bg-white/30 backdrop-blur-md">
        <h2 className="text-6xl font-black tracking-tight mb-12">The Quasar Method</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white p-12 rounded-[3rem] shadow-xl border border-white">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl mb-6" />
              <h3 className="text-2xl font-black mb-4">Neural Synthesis {i}</h3>
              <p className="text-slate-500 italic">Advanced cognitive pattern recognition for elite scoring.</p>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}
