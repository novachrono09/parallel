'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const exampleDecisions = [
  "I almost moved to Berlin in 2021 but stayed in my hometown",
  "I chose computer science over music school in 2018",
  "I stayed at my corporate job instead of joining my friend's startup",
  "I ended a 4-year relationship to focus on myself",
];

interface DecisionInputProps {
  onGenerate: (decision: string, yearsToSimulate: number) => void;
  isLoading: boolean;
}

export default function DecisionInput({ onGenerate, isLoading }: DecisionInputProps) {
  const [decision, setDecision] = useState('');
  const [yearsToSimulate, setYearsToSimulate] = useState(5);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (decision.trim() && !isLoading) {
      onGenerate(decision.trim(), yearsToSimulate);
    }
  };

  const handleExampleClick = (example: string) => {
    setDecision(example);
  };

  const yearsOptions = [3, 5, 7, 10];

  return (
    <motion.section 
      className="w-full max-w-2xl mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Title */}
      <motion.h1 
        className="font-serif text-5xl md:text-6xl font-medium tracking-tight text-foreground mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        PARALLEL
      </motion.h1>
      <motion.p 
        className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        explore the lives you never lived
      </motion.p>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className={`relative rounded-xl transition-all duration-300 ${isFocused ? 'ring-1 ring-primary/30' : ''}`}>
          <textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value.slice(0, 500))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe a life decision you made..."
            className="w-full h-36 px-5 py-4 bg-card border border-border rounded-xl 
                     text-foreground placeholder:text-muted-foreground/40
                     focus:outline-none resize-none transition-all duration-300 
                     text-[15px] leading-relaxed"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-4 text-[10px] text-muted-foreground/40 tabular-nums">
            {decision.length}/500
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mt-4 mb-6">
          <p className="text-[11px] text-muted-foreground/60 mb-2">Try one of these:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleDecisions.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="px-3 py-1.5 text-[11px] text-muted-foreground/70 bg-muted/20 
                         hover:bg-muted/40 hover:text-muted-foreground rounded-full 
                         transition-all duration-200 disabled:opacity-40 text-left"
              >
                "{example.substring(0, 35)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Years selector pills */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs text-muted-foreground mr-2">Simulate</span>
          {yearsOptions.map((years) => (
            <button
              key={years}
              onClick={() => setYearsToSimulate(years)}
              disabled={isLoading}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                ${yearsToSimulate === years 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                } disabled:opacity-40`}
            >
              {years} years
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!decision.trim() || isLoading}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-all duration-200 shadow-lg shadow-primary/10
                   hover:shadow-primary/20 active:scale-[0.98]"
          whileHover={{ scale: decision.trim() && !isLoading ? 1.02 : 1 }}
          whileTap={{ scale: decision.trim() && !isLoading ? 0.98 : 1 }}
        >
          Split Timeline
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
