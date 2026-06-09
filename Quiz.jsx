import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertCircle, CheckCircle2, ChevronRight, HelpCircle, BrainCircuit } from 'lucide-react';

const SAT_QUIZ_DATA = [
  {
    id: 1,
    category: "Reading & Writing (Inference)",
    difficulty: "Elite",
    passage: "In the 19th century, many naturalists viewed the fossil record as a literal transcript of history. However, modern taphonomy suggests that the 'transcript' is heavily edited by geological processes, leading to 'lacunae' that are often misinterpreted as sudden biological extinctions.",
    question: "Based on the text, what is the most likely relationship between 'lacunae' and the naturalists' view?",
    options: [
      "The lacunae confirmed the naturalists' belief in a literal transcript.",
      "The lacunae likely caused naturalists to perceive events that never actually occurred.",
      "The lacunae provided the primary evidence for modern taphonomic theories.",
      "The naturalists were the first to identify the geological causes of these lacunae."
    ],
    correct: 1,
    socraticHint: "Consider the word 'misinterpreted.' If a naturalist sees a gap (lacuna) and thinks it's an extinction, is that extinction a reality or a result of the 'edited' record?",
    trapAnalysis: "You likely fell for the 'Literal Interpretation Trap.' Students often choose A because the text mentions naturalists and transcripts in the same sentence, but it ignores the contrast word 'However'.",
    reasoning: "The text says gaps are 'misinterpreted as sudden extinctions.' Therefore, naturalists saw extinctions (events) where there were actually just geological gaps (non-events)."
  },
  {
    id: 2,
    category: "Advanced Math (Non-linear Constants)",
    passage: "The function f(x) = a(x - h)² + k defines a parabola in the xy-plane. If the parabola passes through (0, 5) and has a vertex at (2, 1), what is the value of 'a'?",
    question: "Solve for the constant 'a'.",
    options: ["1", "2", "0.5", "1.5"],
    correct: 0,
    socraticHint: "Look at the Vertex Form. You have (h, k) and a point (x, y). What happens if you plug (2, 1) and (0, 5) into the equation?",
    trapAnalysis: "The 'Coordinate Swap' error. Many students at the 1500+ level move too fast and swap 'h' and 'k' or 'x' and 'y', leading to a result of 2 or 0.5.",
    reasoning: "Plugging in: 5 = a(0 - 2)² + 1 => 5 = 4a + 1 => 4 = 4a => a = 1."
  }
  // ... Imagine 18 more high-difficulty items here
];

const QuasarQuiz = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [showSocratic, setShowSocratic] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  const handleCheck = () => {
    const correct = selectedIdx === SAT_QUIZ_DATA[currentIdx].correct;
    setIsCorrect(correct);
    setShowSocratic(true);
    if (correct) setScore(score + 1);
  };

  const nextQuestion = () => {
    setCurrentIdx(currentIdx + 1);
    setSelectedIdx(null);
    setShowSocratic(false);
    setIsCorrect(null);
  };

  const currentQ = SAT_QUIZ_DATA[currentIdx];

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[600px]">
      {/* Quiz Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Question {currentIdx + 1} of 20</span>
          <h2 className="text-xl font-bold text-slate-800">{currentQ.category}</h2>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
          <BrainCircuit size={18} className="text-blue-600" />
          <span className="font-mono font-bold text-slate-700">IQ-Mode: Active</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-10 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / 20) * 100}%` }}
          className="h-full bg-blue-600"
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {currentQ.passage && (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-slate-700 leading-relaxed italic shadow-sm">
              "{currentQ.passage}"
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-slate-900">{currentQ.question}</h3>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => !showSocratic && setSelectedIdx(i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                  selectedIdx === i 
                    ? 'border-blue-600 bg-blue-50/50' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                } ${showSocratic && i === currentQ.correct ? 'border-green-500 bg-green-50' : ''}
                  ${showSocratic && i === selectedIdx && i !== currentQ.correct ? 'border-red-400 bg-red-50' : ''}
                `}
              >
                <span className="font-medium text-slate-700">{opt}</span>
                {showSocratic && i === currentQ.correct && <CheckCircle2 className="text-green-500" size={20} />}
              </button>
            ))}
          </div>

          {!showSocratic ? (
            <button
              disabled={selectedIdx === null}
              onClick={handleCheck}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-all"
            >
              Submit Analysis
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Next Strategy <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Socratic Sidebar */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!showSocratic ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-blue-50 p-6 rounded-2xl border border-blue-100"
              >
                <div className="flex items-center gap-2 text-blue-700 mb-4 font-bold">
                  <Lightbulb size={20} />
                  <span>Socratic Clue</span>
                </div>
                <p className="text-sm text-blue-900 leading-relaxed">
                  {currentQ.socraticHint}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}
              >
                <div className={`flex items-center gap-2 mb-4 font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <span>{isCorrect ? "Precision Achieved" : "Strategic Gap Found"}</span>
                </div>
                
                <div className="space-y-4">
                  {!isCorrect && (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-red-400 mb-1">The Trap</h4>
                      <p className="text-sm text-red-900">{currentQ.trapAnalysis}</p>
                    </div>
                  )}
                  <div>
                    <h4 className={`text-xs font-bold uppercase mb-1 ${isCorrect ? 'text-green-400' : 'text-slate-400'}`}>Logical Proof</h4>
                    <p className={`text-sm ${isCorrect ? 'text-green-900' : 'text-slate-600'}`}>{currentQ.reasoning}</p>
                  </div>
                  
                  {isCorrect && (
                    <div className="pt-4 border-t border-green-200 mt-4">
                      <p className="text-xs italic text-green-700">"Excellent. You avoided the Extreme Language Trap. This is the hallmark of a 1550+ scorer."</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuasarQuiz;
