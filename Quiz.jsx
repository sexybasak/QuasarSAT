import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertCircle, CheckCircle2, ChevronRight, BrainCircuit } from 'lucide-react';

const QUIZ_DATA = [
  {
    category: "Writing (Rhetorical)",
    passage: "In 1954, the discovery of the structure of DNA by Watson and Crick revolutionized biology. However, many historians argue that Rosalind Franklin’s X-ray diffraction images provided the crucial 'missing link' that allowed the duo to finalize their model.",
    question: "Which choice most logically completes the text's discussion of the discovery?",
    options: [
      "Watson and Crick would likely have discovered the structure regardless of Franklin.",
      "Franklin's contribution was secondary to the theoretical work done by Watson.",
      "The discovery was a collective triumph rather than a solitary stroke of genius.",
      "X-ray diffraction is the only reliable way to view microscopic structures."
    ],
    correct: 2,
    socraticHint: "Focus on the word 'However' and the phrase 'missing link.' How does this change the 'story' of the discovery from two people to three?",
    trap: "The 'Comparison Trap.' Options A and B try to rank the scientists, but the text focuses on the *necessity* of all parts coming together.",
    reasoning: "The text contrasts the 'discovery by Watson/Crick' with the 'crucial' work of Franklin, implying the result was a product of combined effort."
  },
  {
    category: "Advanced Math",
    passage: "A circle in the xy-plane has the equation (x + 3)² + (y - 5)² = 16.",
    question: "Which of the following points lies on the circle?",
    options: ["(1, 5)", "(-3, 1)", "(-3, 9)", "Both A and C"],
    correct: 3,
    socraticHint: "Substitute the points. The distance from the center (-3, 5) to any point must be the radius (4).",
    trap: "The 'Square Root Trap.' Many forget that 16 is r², so the radius is 4. They might look for distances of 16.",
    reasoning: "For (1, 5): (1+3)² + (5-5)² = 4² + 0 = 16. For (-3, 9): (-3+3)² + (9-5)² = 0 + 4² = 16. Both are correct."
  }
];

export default function Quiz() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleNext = () => {
    if (idx < QUIZ_DATA.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      alert(`Diagnostic Complete. Your Cognitive Score: ${score}/${QUIZ_DATA.length}`);
    }
  };

  const current = QUIZ_DATA[idx];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left: Question Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Question {idx + 1} of 20</span>
            <div className="flex items-center gap-2 text-slate-400 text-xs"><BrainCircuit size={14}/> Socratic Mode</div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm italic text-slate-700">"{current.passage}"</div>
          <h3 className="text-xl font-bold">{current.question}</h3>

          <div className="space-y-3">
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => !showResult && setSelected(i)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                  selected === i ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200 bg-white'
                } ${showResult && i === current.correct ? 'border-green-500 bg-green-50' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>

          {!showResult ? (
            <button 
              disabled={selected === null}
              onClick={() => { setShowResult(true); if(selected === current.correct) setScore(score+1); }}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
            >
              Analyze Selection
            </button>
          ) : (
            <button onClick={handleNext} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">
              Next Question
            </button>
          )}
        </div>

        {/* Right: Socratic Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 font-bold mb-3"><Lightbulb size={18}/> Socratic Clue</div>
            <p className="text-sm text-blue-800 leading-relaxed">{current.socraticHint}</p>
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-3xl border ${selected === current.correct ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  {selected === current.correct ? <CheckCircle2 className="text-green-600"/> : <AlertCircle className="text-red-600"/>}
                  {selected === current.correct ? "Mastery Confirmed" : "Cognitive Trap Found"}
                </h4>
                <p className="text-xs font-bold uppercase text-slate-400 mt-4 mb-1 tracking-tighter">The Error Pattern</p>
                <p className="text-sm text-slate-700 mb-4">{current.trap}</p>
                <p className="text-xs font-bold uppercase text-slate-400 mb-1 tracking-tighter">Logic Proof</p>
                <p className="text-sm text-slate-700">{current.reasoning}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
