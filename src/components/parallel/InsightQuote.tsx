'use client';

import { motion } from 'framer-motion';

interface InsightQuoteProps {
  insight: string;
}

export default function InsightQuote({ insight }: InsightQuoteProps) {
  return (
    <motion.section
      className="w-full max-w-2xl mx-auto py-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Decorative elements */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <motion.div 
          className="w-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.div 
          className="w-2 h-2 rounded-full bg-primary/40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        />
        <motion.div 
          className="w-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4 }}
        />
      </div>

      {/* Quote */}
      <motion.blockquote 
        className="font-serif text-lg md:text-xl text-foreground/90 italic leading-relaxed px-6 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        "{insight}"
      </motion.blockquote>

      {/* Decorative elements */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <motion.div 
          className="w-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.div 
          className="w-2 h-2 rounded-full bg-primary/40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        />
        <motion.div 
          className="w-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4 }}
        />
      </div>
    </motion.section>
  );
}
