import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  BrainCircuit, 
  RotateCcw, 
  Award,
  BookOpen,
  Target
} from 'lucide-react';

// MATH RENDERING IMPORTS
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

import { QUIZ_DATA } from './questions.js';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // --- MATH FORMATTER HELPER ---
  // This detects $math$ in your strings and renders it using KaTeX
  const formatContent = (text) => {
    if (typeof text !== 'string') return text;
    const parts = text.split(/(\$.*?\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.substring(1, part.length - 1);
        return <InlineMath key={i} math={math} />;
      }
      return part;
    });
  };

  // --- INITIALIZE & RANDOMIZE ---
  useEffect(() => {
    const shuffled = [...QUIZ_DATA]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20); // Pick 20 for a standard session
    setQuestions(shuffled);
  }, []);

  const handleSelection = (key) => {
    if (!showExplanation) {
      setSelectedIdx(key); // Key is "A", "B", "C", or "D"
    }
  };

  const handleSubmit = () => {
    if (selectedIdx === questions[currentIdx].correct_answer) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (questions.length === 0) return (
    <div className="flex items-center justify-center h-96 text-blue-600 font-black animate-pulse uppercase tracking-[0.3em]">
      Initializing Neural Diagnostic...
    </div>
  );

  // --- RESULT SCREEN ---
  if (isFinished) {
    const estimatedScore = Math.round((score / questions.length) * 800 + 800);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[3rem] shadow-2xl border border-white text-center">
          <Award size={64} className="text-blue-600 mx-auto mb-6" />
          <h2 className="text-5xl font-black tracking-tighter mb-2">Diagnostic Result</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">SAT Cognitive Equivalency</p>
          
          <div className="inline-block bg-slate-900 text-white px-12 py-8 rounded-[2rem] mb-12 shadow-2xl shadow-blue-200">
            <div className="text-6xl font-black tracking-tighter">{estimatedScore}</div>
            <div className="text-[10px] opacity-50 font-black uppercase tracking-[0.2em] mt-2">Estimated Scale Score</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
              <h4 className="font-black text-xs uppercase text-blue-600 mb-2">Accuracy Level</h4>
              <p className="text-2xl font-black text-slate-800">{(score / questions.length) * 100}% Precision</p>
            </div>
            <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
              <h4 className="font-black text-xs uppercase text-indigo-600 mb-2">Performance Tier</h4>
              <p className="text-2xl font-black text-slate-800">{estimatedScore >= 1500 ? 'Elite (Ivy Range)' : 'Advanced'}</p>
            </div>
          </div>

          <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl">
            Re-calibrate Neural Map
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <BrainCircuit size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Module: {currentQ.domain}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">{currentQ.skill}</h2>
        </div>

        <div className="bg-white/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-white flex items-center gap-6 shadow-sm">
          <div className="text-right">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Efficiency</div>
            <div className="text-lg font-black text-slate-700">{currentIdx + 1}<span className="text-slate-300">/</span>{questions.length}</div>
          </div>
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT: THE WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-white/60 relative overflow-hidden"
          >
            {/* Passage/Equation Area */}
            <div className="mb-10 p-8 bg-slate-50/80 rounded-[2rem] border-l-8 border-blue-600 text-lg text-slate-700 leading-relaxed font-medium">
              {formatContent(currentQ.question_text)}
            </div>

            <div className="space-y-4">
              {Object.entries(currentQ.choices).map(([key, value]) => {
                const isSelected = selectedIdx === key;
                const isCorrect = key === currentQ.correct_answer;
                
                let style = "border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/20";
                if (isSelected) style = "border-blue-600 bg-blue-50/50 shadow-inner";
                if (showExplanation) {
                  if (isCorrect) style = "border-green-500 bg-green-50 shadow-md";
                  else if (isSelected) style = "border-red-400 bg-red-50";
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleSelection(key)}
                    disabled={showExplanation}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${style}`}
                  >
                    <div className="flex items-center gap-5">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                        {key}
                      </span>
                      <span className="font-bold text-slate-700 text-lg">
                        {formatContent(value)}
                      </span>
                    </div>
                    {showExplanation && isCorrect && <CheckCircle2 className="text-green-500" size={24} />}
                  </button>
                );
              })}
            </div>

            <div className="mt-12">
              {!showExplanation ? (
                <button
                  disabled={selectedIdx === null}
                  onClick={handleSubmit}
                  className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 disabled:opacity-20 transition-all shadow-xl shadow-blue-900/10"
                >
                  Confirm Strategic Analysis
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                >
                  Load Next Vector <ChevronRight size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: SOCRATIC INTELLIGENCE */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Constant Socratic Clue */}
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl">
            <div className="flex items-center gap-3 text-blue-600 font-black mb-6">
              <Lightbulb size={24} />
              <span className="text-[10px] uppercase tracking-[0.3em]">Cognitive Clue</span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              {formatContent(currentQ.socraticHint || "Evaluate the relationship between the independent variable and the constant. At the 1500+ level, the SAT often hides the logic in the 'units' of the equation.")}
            </p>
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-8 rounded-[2.5rem] border ${selectedIdx === currentQ.correct_answer ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}
              >
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 text-slate-900 font-black mb-3">
                      <Target size={20} className={selectedIdx === currentQ.correct_answer ? 'text-green-600' : 'text-red-600'} />
                      <span className="text-[10px] uppercase tracking-[0.3em]">Strategic Trap</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic font-medium">
                      "{currentQ.trap || "The common error here is misinterpreting the y-intercept as a rate of change. 1500+ scorers isolate the constant before processing the coefficient."}"
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-200/50">
                    <div className="flex items-center gap-3 text-slate-900 font-black mb-3">
                      <BookOpen size={20} className="text-blue-600" />
                      <span className="text-[10px] uppercase tracking-[0.3em]">Logical Proof</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed font-bold">
                      {formatContent(currentQ.reasoning || "By applying the power rule or isolating $w$, we confirm the relationship is linear. Substituting $x=0$ yields the initial state.")}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showExplanation && (
            <div className="p-10 bg-gradient-to-br from-slate-900 to-blue-900 rounded-[2.5rem] text-white text-center shadow-2xl">
              <div className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Focus Required</div>
              <p className="text-sm font-medium opacity-70 leading-relaxed italic">"Precision is the difference between a 1450 and a 1550. Don't rush the equation."</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
