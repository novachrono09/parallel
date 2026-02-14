'use client';

import { motion } from 'framer-motion';

export default function LoadingState() {
  return (
    <motion.div
      className="w-full max-w-2xl mx-auto py-24 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated circles */}
      <div className="flex justify-center gap-3 mb-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 bg-primary/50 rounded-full"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Loading message */}
      <motion.p
        className="font-serif text-xl text-muted-foreground"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        Branching your reality...
      </motion.p>

      {/* Skeleton Timeline Preview */}
      <div className="mt-20 flex justify-center gap-10 px-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 + 0.2 }}
          >
            {/* Timeline header skeleton */}
            <div className="w-16 h-3 bg-muted/20 rounded animate-pulse" />
            {/* Vertical line */}
            <div className="w-px h-36 bg-gradient-to-b from-border/30 via-border/10 to-transparent" />
            {/* Event cards skeleton */}
            {[0, 1, 2].map((j) => (
              <motion.div
                key={j}
                className="w-20 h-14 bg-muted/15 rounded-lg"
                animate={{ opacity: [0.08, 0.15, 0.08] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.08 + j * 0.12,
                }}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
