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
  BookOpen
} from 'lucide-react';
import { QUIZ_DATA } from './questions.js';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize and Shuffle Questions
  useEffect(() => {
    // Select 20 random questions from your pool of 50
    const shuffled = [...QUIZ_DATA]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);
    setQuestions(shuffled);
  }, []);

  const handleSelection = (idx) => {
    if (!showExplanation) {
      setSelectedIdx(idx);
    }
  };

  const handleSubmit = () => {
    if (selectedIdx === questions[currentIdx].correct) {
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

  const restartQuiz = () => {
    window.location.reload(); // Quick reset to reshuffle
  };

  if (questions.length === 0) return <div className="p-20 text-center">Loading Assessment...</div>;

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-2xl mx-auto py-20 px-6 text-center"
      >
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
            <Award size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Diagnostic Complete</h2>
          <p className="text-slate-500 mb-8 font-medium">Your Cognitive Readiness Score</p>
          
          <div className="text-7xl font-black text-blue-600 mb-10">
            {Math.round((score / questions.length) * 800 + 800)} 
            <span className="text-xl text-slate-300 ml-2 font-bold">/ 1600 EST.</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10 text-left">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</div>
              <div className="text-xl font-bold text-slate-800">{(score / questions.length) * 100}%</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
              <div className="text-xl font-bold text-slate-800">{score > 15 ? 'Elite Tier' : 'Advanced'}</div>
            </div>
          </div>

          <button 
            onClick={restartQuiz}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg"
          >
            <RotateCcw size={20} /> Retake Assessment
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <BrainCircuit size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">1500+ Socratic Module</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{currentQ.category}</h2>
        </div>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Progress</div>
            <div className="text-sm font-bold text-slate-700">{currentIdx + 1} <span className="text-slate-300">/</span> {questions.length}</div>
          </div>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: QUESTION PANEL */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50"
          >
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-l-4 border-blue-600 text-slate-700 leading-relaxed font-medium italic">
              "{currentQ.question_text || currentQ.passage}"
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-8 leading-snug">
              {currentQ.question}
            </h3>

            <div className="space-y-4">
              {Object.entries(currentQ.choices || {}).map(([key, value], i) => {
                const isSelected = selectedIdx === i;
                const isCorrect = i === currentQ.correct;
                
                let borderColor = "border-slate-100";
                let bgColor = "bg-white";
                
                if (isSelected) {
                  borderColor = "border-blue-600";
                  bgColor = "bg-blue-50/30";
                }
                
                if (showExplanation) {
                  if (isCorrect) {
                    borderColor = "border-green-500";
                    bgColor = "bg-green-50";
                  } else if (isSelected) {
                    borderColor = "border-red-400";
                    bgColor = "bg-red-50";
                  }
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleSelection(i)}
                    disabled={showExplanation}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${borderColor} ${bgColor}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 transition-colors'}`}>
                        {key}
                      </span>
                      <span className="font-semibold text-slate-700">{value}</span>
                    </div>
                    {showExplanation && isCorrect && <CheckCircle2 className="text-green-500" size={20} />}
                  </button>
                );
              })}
            </div>

            <div className="mt-10">
              {!showExplanation ? (
                <button
                  disabled={selectedIdx === null}
                  onClick={handleSubmit}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200"
                >
                  Analyze Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                >
                  Next Challenge <ChevronRight size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: SOCRATIC SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Socratic Hint - Always visible before answer */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
              <Lightbulb size={20} />
              <span className="text-sm uppercase tracking-wider">Cognitive Clue</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {currentQ.socraticHint || "Look closely at the relationship between the variables provided in the first sentence. Does a change in 'x' impact the value linearly or exponentially?"}
            </p>
          </div>

          {/* Explanation Area - Revealed after answer */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl border ${selectedIdx === currentQ.correct ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}
              >
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                      <AlertCircle size={18} className={selectedIdx === currentQ.correct ? 'text-green-600' : 'text-red-600'} />
                      <span className="text-sm uppercase tracking-wider">The Strategic Trap</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      "{currentQ.trap || "The SAT often uses 'distractor' values that look correct if you only perform the first step of the calculation. This tests your persistence through multi-step logic."}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                      <BookOpen size={18} className="text-blue-600" />
                      <span className="text-sm uppercase tracking-wider">Logical Proof</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {currentQ.reasoning || "By isolating the variable and checking against the original equation, we confirm that the ratio remains constant regardless of the coefficient's value."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Motivation Card */}
          {!showExplanation && (
            <div className="p-8 bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl text-white text-center">
              <div className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Precision Goal</div>
              <p className="text-sm font-medium opacity-80 italic">"1500+ scorers don't pick the 'best' answer; they eliminate the three 'impossible' ones."</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
